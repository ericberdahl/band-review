import { z } from 'astro/zod';

import { announcerSchema } from './announcerSchema';
import { concertEventSchema } from './concertEventSchema';
import { fieldShowEventSchema } from './fieldShowEventSchema';
import { paradeEventSchema } from './paradeEventSchema';
import { showCitationSchema } from './showCitationSchema';

export const bandReviewSchema = z.object({
    announcer: announcerSchema,
    show: showCitationSchema,
    next_show: showCitationSchema,
    "sponsors-general": z.any(), // TODO Replace z.any() with the appropriate schema for sponsors-general if available
    version: z.number(),
    units: z.array(z.string()),
    parade: paradeEventSchema,
    fieldshow: fieldShowEventSchema,
    concert: concertEventSchema,
}).strict();

export type BandReview = z.infer<typeof bandReviewSchema>;
