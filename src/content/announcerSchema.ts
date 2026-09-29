import { z } from 'astro/zod';

export const announcerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
}).strict();

export type Announcer = z.infer<typeof announcerSchema>;
