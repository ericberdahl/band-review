import { z } from 'astro/zod';

export const showCitationSchema = z.object({
    date: z.iso.date(),
    citation: z.string().nonempty(),
}).strict();

export type ShowCitation = z.infer<typeof showCitationSchema>;
