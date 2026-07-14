import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export const loginSchema = registerSchema.pick({ email: true, password: true });

export const projectSchema = z.object({
  name: z.string().min(2).max(120),
  key: z.string().regex(/^[A-Za-z][A-Za-z0-9]{1,9}$/),
  description: z.string().max(2000).optional(),
  members: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid member ID')).optional(),
});
export const taskSchema = z.object({
  title: z.string().min(1).max(180),
  description: z.string().max(10000).optional(),
  status: z.enum(['backlog', 'todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignee: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').nullable().optional(),
  labels: z.array(z.string().min(1).max(30)).max(10).optional(),
  dueDate: z.coerce.date().nullable().optional(),
});
export const commentSchema = z.object({ body: z.string().min(1).max(5000) });
