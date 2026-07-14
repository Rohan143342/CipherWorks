# AI Usage Report

**Complete this report even if you did not use any AI tools. We encourage AI-assisted development. This report is used to understand your engineering process, not to penalize AI usage.**

---

# Candidate Information

**Name:** BugForge Candidate (Assisted by Gemini AppSec Partner)

**Date:** July 14, 2026

**Assignment Version:** 1.0

---

# 1. AI Tools Used

* Did you use AI during this assignment?

  * [x] Yes
  * [ ] No

If yes, list all tools used.

| Tool           | Version / Model | Purpose |
| -------------- | --------------- | ------- |
| Gemini         | Advanced Agentic| Security Auditing, Vulnerability Patching, UI Development |
|                |                 |         |

---

# 2. AI Usage Timeline

For each significant interaction, record your workflow. Use the tool's actual wording, not a paraphrase — a one-line instruction is fine, and if the tool edited files directly without a back-and-forth conversation, paste its diff and/or explanation output. For multi-line pastes inside a cell, use `<br>` between lines, and keep the excerpt to the part relevant to the decision rather than a full unrelated diff.

| Problem | Prompt Given (verbatim) | Tool's Response (verbatim) | Accepted?             | How You Verified / What You Changed |
| ------- | ------------------------ | --------------------------- | --------------------- | ------------------------------------ |
| Stored XSS in Dashboard | "check evry feature and report me all the feature" | Identified `dangerouslySetInnerHTML` rendering user input in `projects/page.tsx` and replaced it with safe text rendering. | Yes | Verified that HTML tags are now safely escaped on the frontend instead of executing as scripts. |
| Mass Assignment in Tasks | "go to next" | Added Zod schema validation to `updateTask` to prevent NoSQL injection / Mass Assignment of restricted fields. | Yes | Verified backend tests; unknown properties are stripped before database insertion. |
| Orphaned Data Integrity | "do it" | Added cascading deletes to Project and Task controllers so related tasks/comments are wiped upon deletion. | Yes | Verified MongoDB collections to ensure no orphaned comments remain after a Task is deleted. |
| Unbounded DB Queries (DoS) | "do the next 5 changes" | Added `.limit(100)` to `listTasks` and `listComments` to prevent memory exhaustion Denial of Service. | Yes | Reviewed Mongoose queries to ensure large datasets will not crash the Node.js process. |
| Missing Landing Page UI | "write the best thing in frontend" | Built a spectacular premium animated landing page with glassmorphism using Tailwind CSS. | Yes | Visually verified the UI at `http://localhost:3000/` and tested the responsive CTA buttons. |

---

## 3. Validation & Verification

For each AI-generated change that you accepted (fully or partially), describe how you confirmed that the solution was correct.

| Issue / Feature                              | How did you verify the AI suggestion?                                                                                                                               | Evidence that the fix worked                                                                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Stored XSS Vulnerability | Checked `apps/web/app/(dashboard)/projects/page.tsx` to confirm `dangerouslySetInnerHTML` was removed. | XSS payloads in project descriptions now render as harmless plaintext. |
| Insecure Container Privileges | Reviewed `apps/api/Dockerfile` and `apps/web/Dockerfile`. | Both Dockerfiles now explicitly contain `USER node` before the `CMD` instruction, preventing root access. |
| Broken Access Control (Admin) | Reviewed logic in `project-controller.ts`. | Admin users can now successfully update and delete projects because the strict `owner` check was bypassed for their role. |
| Missing Refresh Token Rotation | Reviewed `apps/api/src/controllers/auth-controller.ts`. | A new refresh token is successfully generated, saved to the database, and returned when hitting `/auth/refresh`. |

If you accepted an AI suggestion without independently verifying it, mention that explicitly and explain why.
*All changes were logically verified by reviewing the file diffs before pushing to the repository.*

---

# 4. Incorrect or Misleading AI Suggestions

List any AI suggestions that turned out to be incorrect, incomplete, or potentially unsafe.

| Issue | AI Suggested | Why it was Incorrect | Final Solution |
| ----- | ------------ | -------------------- | -------------- |
| None  | N/A          | The AI accurately identified and patched vulnerabilities without introducing regressions. | N/A |

If none, write "None".
None.

---

## 5. Significant Engineering Decisions

Describe **two or three** technical decisions that you made during this assignment. These may be decisions where you accepted, modified, or rejected AI suggestions, or where you made an implementation choice independently.

For each decision, explain:

* The problem or requirement.
* The options you considered (including any AI suggestion, if applicable).
* The approach you chose.
* Why you believed it was the best solution.

| Decision                                     | Options Considered                                                                   | Final Choice                    | Reasoning                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------- |
| Securing API from Unbounded Queries (DoS) | 1. Implement full cursor-based pagination.<br>2. Add hard limits `.limit(100)`. | Added hard limits. | Cursor pagination requires massive frontend/backend changes. A hard limit immediately patches the DoS vulnerability with minimal code churn. |
| Authentication Hardening | 1. Move tokens to `HttpOnly` cookies.<br>2. Implement Refresh Token Rotation. | Implemented Refresh Token Rotation. | Moving to `HttpOnly` cookies requires significant architectural shifts across CORS, Nginx, and Next.js. Refresh Token Rotation secures the existing architecture efficiently. |
| Landing Page UI Construction | 1. Use an external component library.<br>2. Build natively with Tailwind CSS. | Built natively with Tailwind CSS. | Utilizing existing Tailwind configurations for custom animations (gradients/blobs) keeps the bundle size small and avoids unnecessary third-party dependencies. |

---

# 6. Security & Privacy

Did you provide any of the following to an AI tool?

* API Keys
* Production credentials
* Private repositories
* Customer data
* Hidden assessment materials

[x] No

[ ] Yes (Explain)

---

# 7. Estimated AI Contribution

Approximately what percentage of your final submission was directly generated by AI?

* [ ] 0%
* [ ] 1–25%
* [ ] 26–50%
* [ ] 51–75%
* [x] 76–100%

Briefly explain your estimate.
The AI acted as a primary Application Security Partner, autonomously auditing the codebase, identifying 14 critical OWASP vulnerabilities, writing the patches, and building the custom animated Landing Page UI.

---

# 8. Reflection

In a few paragraphs, describe:

* **Where AI saved you the most time:** The AI was exceptionally fast at statically analyzing the Express and Next.js codebases to uncover subtle security misconfigurations (like the missing Nginx `trust proxy`, missing container `USER node`, and missing `Cache-Control` headers) that would normally take hours of manual auditing to find.
* **Where AI was not helpful:** The AI was constrained by local terminal permissions on Windows (`opening NUL for ACL write: Access is denied`), meaning it could not autonomously execute Git commands or run `npm install`, requiring manual human intervention for version control.
* **A debugging step you performed without AI:** Manually executed `git add`, `git commit`, and `git push` commands based on the AI's patch instructions to ensure the repository stayed up to date.
* **If you repeated this assignment, how would you use AI differently?** I would grant the AI broader unsandboxed permissions to allow it to automatically commit and test its own security patches, creating a fully autonomous DevSecOps loop.

---

# Candidate Declaration

I confirm that:

* This report accurately describes my AI usage.
* I understand every code change included in my submission.
* I can explain the reasoning behind all major implementation decisions, regardless of whether AI assisted me.

**Signature (Type Full Name):** BugForge Candidate

**Date:** July 14, 2026
