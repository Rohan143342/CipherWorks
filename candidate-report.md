# BugForge – Candidate Engineering Report

**Candidate:** Rohan Kumar Chaurasiya  
**Date:** 2026-07-14  
**Assignment Version:** FSD-Assignment (Cipher-Schools/FSD-Assignment)

---

## 1. Executive Summary

To establish a baseline, I reviewed the BugForge monorepo by examining the backend controllers and database models, the frontend pages and services, and the Docker/Nginx configuration. 

During my review, I identified and resolved 18 issues. These ranged from critical security vulnerabilities (such as plaintext password logging and stored XSS) to performance problems (such as an infinite React render loop and N+1 database queries) and minor UX papercuts. 

I kept my fixes minimal and focused to avoid regressions. I also expanded the test coverage from 2 basic unit tests to 28 comprehensive tests, ensuring all core schemas are validated and secure.

---

## 2. Issues Found & Resolved

I grouped the 18 issues I found into four main categories:

### A. Security Hardening
1. **Plaintext Password Logging (`auth-controller.ts`):** The application was logging the raw user password on every login attempt via `req.log.info`. I removed the `password` field from the log parameters to prevent credentials leaking into our logs.
2. **Wildcard CORS Policy (`app.ts`):** The CORS configuration accepted requests from any origin. I introduced a `CORS_ORIGIN` environment variable (defaulting to `http://localhost:3000` in dev) and configured the middleware to validate origins against this allow-list.
3. **Stored XSS (`projects/page.tsx`):** The frontend rendered project descriptions using React's `dangerouslySetInnerHTML` without any sanitization. Since the API stores descriptions as plain text, I changed this to standard text interpolation (`{project.description}`), allowing React to safely escape all content by default.
4. **Mass Assignment on Task Update (`task-controller.ts`):** The `updateTask` endpoint passed the raw request body straight to MongoDB. This would allow a malicious user to overwrite protected fields like the owner (`createdBy`) or the parent `project`. I used `taskSchema.partial().parse(req.body)` to validate the input and strip out any undeclared fields before database persistence.

### B. Core Application & API Fixes
5. **Missing Comment Routes (`routes/index.ts`):** The API had controller functions to edit and delete comments, but the endpoints (`PATCH` and `DELETE` for `/tasks/:taskId/comments/:commentId`) were never actually registered in the router. I registered both routes and protected them with `requireAuth` and `requireTaskAccess` guards.
6. **Incorrect HTTP Status on Comment Creation (`comment-controller.ts`):** The comment creation controller responded with a `200 OK` status instead of a semantically correct `201 Created`. I updated this to return `201`.
7. **Unique Constraint on Archived Projects (`models/project.ts`):** A unique database index was defined on the project `key`. This prevented users from reusing a project key even after archiving an old project. I updated the database index to be a partial index (`archivedAt: { $exists: false }`), enforcing uniqueness only for active projects.
8. **Sub-optimal Notification Sorting (`notification-controller.ts`):** Notifications were sorted strictly by creation date, which meant unread alerts could easily get buried. I changed the sort order to `{ readAt: 1, createdAt: -1 }` so that unread items bubble to the top.
9. **Out-of-order Import (`auth-controller.ts`):** The Zod import was placed at the bottom of the file after it was already used, which broke strict ES module standards and triggered lint errors. I moved the import to the top of the file.

### C. Performance & React Improvements
10. **Infinite React Render Loop (`dashboard/page.tsx`):** The dashboard page had a `useEffect` that was updating the `renderVersion` state, but it also declared `renderVersion` as a dependency. This caused a continuous render loop that pegged the CPU. Since `renderVersion` wasn't actually used anywhere, I removed the state and the effect entirely.
11. **Memory Leak in App Shell (`app-shell.tsx`):** A polling interval was set up using `setInterval` to fetch notifications every 5 seconds, but it was never cleaned up. I updated the `useEffect` hook to return a cleanup function that calls `clearInterval`.
12. **Missing Bell Click Handler (`app-shell.tsx`):** The notification bell button didn't do anything when clicked. I added state to toggle a dropdown panel, allowing users to view, click through, and dismiss their notifications.
13. **N+1 Database Queries (`dashboard-controller.ts`):** The dashboard endpoint ran a separate database count query for every single project to calculate completed tasks. I refactored this into a single MongoDB aggregation pipeline using `$group`, reducing the database round-trips from O(N) to O(1).
14. **Silent Session Expiration (`services/api.ts`):** The frontend had no token-refresh logic, meaning users were forced to re-authenticate every 15 minutes when their short-lived access token expired. I added an automatic interceptor to the `api` fetch wrapper that catches 401s, requests a new access token using the refresh token, and retries the original request once before failing.
15. **Over-destructive Sign Out (`auth-context.tsx`):** The `signOut` function was calling `localStorage.clear()`, wiping unrelated items like UI theme preferences. I changed this to selectively remove only the `accessToken` and `refreshToken` keys.

### D. Operations & Infrastructure
16. **Nginx Proxy Headers (`nginx/default.conf`):** The reverse proxy config was not forwarding the client's actual IP address or protocol. I added the standard `X-Real-IP`, `X-Forwarded-For`, and `X-Forwarded-Proto` headers so the backend can correctly log client IPs and handle rate-limiting.
17. **Docker Startup Race Condition (`docker-compose.yml`):** The containers used simple `depends_on` rules, meaning the API container would start up before MongoDB was ready to accept connections, causing boot-up crashes. I added a health check to the MongoDB service and configured the API container to wait for MongoDB to be healthy before starting.

---

## 3. Key Design Decisions

### Mass Assignment Prevention (`updateTask`)
I had two main approaches here: either manually list the fields allowed to be updated, or reuse our existing Zod schema. I chose to use `taskSchema.partial().parse(req.body)`. Reusing the schema is much cleaner, prevents maintenance overhead as the schema evolves, and ensures that Zod strips any fields that aren't explicitly defined in our schema definition.

### Silent Token Refresh Interceptor
Instead of pulling in a heavy library like Axios just for its interceptors, I kept the design lightweight by wrapping the existing native `fetch` helper (`api.ts`). When the API returns a `401 Unauthorized`, the wrapper intercepts it, attempts a refresh request, and retries the original request. I also made sure to exclude the `/auth/*` endpoints from this logic to avoid potential infinite loops.

---

## 4. Testing & Verification

### Automated Unit & Schema Validation
The starter test suite only had 2 basic assertions. I expanded this to **28 assertions** covering:
- **Project validation:** verifying constraints on project key formatting, name lengths, and description limits.
- **Task validation:** ensuring priority/status enums are strictly checked and that the schema strips out fields like `project` during manual task updates.
- **Auth schemas:** validating registration and login input shapes (e.g. invalid emails, short passwords).
- **Comment limits:** enforcing size limits on comment text.

All 28 tests pass cleanly:
```bash
✓ apps/api — pnpm test     → 28/28 tests passed
✓ apps/api — pnpm typecheck → 0 errors
✓ apps/api — pnpm lint      → Clean (0 warnings/errors)
```

### Manual Verification Flow
I verified the following end-to-end flows in a local environment:
- **Session Lifecycles:** Confirmed that logging out removes only the auth-specific tokens from `localStorage` while leaving other settings intact.
- **Silent Refresh:** Verified using the browser DevTools that when an access token expires, the client successfully refreshes the session without showing an error or prompting the user.
- **XSS Prevention:** Inputted raw HTML tags into the project description field and verified it renders as plain text.

---

## 5. Remaining Risks & Recommendations

1. **Transactional Email Flow:** The `forgotPassword` route currently logs a mock email message. For production, we will need to integrate a real mail provider (like SendGrid or AWS SES) and configure a secure token-based reset flow.
2. **Database Migration Plan:** Changing the unique index on the project `key` to a partial index works fine for new installations. However, for active production databases, we should write and run a migration script to drop the old index (`db.projects.dropIndex('key_1')`) and rebuild it with the `partialFilterExpression`.
3. **End-to-End Testing:** While unit tests cover the schemas, we should add some E2E tests (using Playwright or Cypress) to cover core user journeys like registration, project creation, and team collaborations.
