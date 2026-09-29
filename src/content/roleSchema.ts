import { z } from 'zod';

export const roleSchema = z.object({
    title: z.string().nonempty(),
    members: z.array(z.string().nonempty()),
}).strict();

export type Role = z.infer<typeof roleSchema>;
