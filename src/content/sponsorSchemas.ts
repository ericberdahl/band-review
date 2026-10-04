import { allowEmptyArray } from './schemaUtils';

import { z } from 'astro/zod';

export const sponsorSchema = z.object({
    sponsor: z.string(),
    presenter: z.string().optional(),
    dedication: z.string().optional(),
    message: z.string().optional(),
}).strict();

export type Sponsor = z.infer<typeof sponsorSchema>;

export const trophySponsorSchema = z.object({
    place: z.string(),
    sponsors: z.array(sponsorSchema),
}).strict();

export type TrophySponsor = z.infer<typeof trophySponsorSchema>;

export const competitionSponsorSchema = z.object({
    general: allowEmptyArray(z.string()),
    trophies: allowEmptyArray(trophySponsorSchema),
}).strict();

export type CompetitionSponsor = z.infer<typeof competitionSponsorSchema>;
