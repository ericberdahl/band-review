import { z } from 'astro/zod';

export const concertEventSchema = z.object();

export type ConcertEvent = z.infer<typeof concertEventSchema>;
