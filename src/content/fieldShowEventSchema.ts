import { competitionSponsorSchema } from './sponsorSchemas';
import { breakUnitSchema } from './breakUnitSchema';

import { reference } from 'astro:content';
import { z } from 'astro/zod';

const anthemPerformerSchema = z.object({
    anthemPerformer: z.string().nonempty(),
}).strict().transform((data) => ({ ...data, unitType: 'anthemPerformer' }));

const awardsUnitSchema = z.object({
    awardsLabel: z.string().nonempty(),
    location: z.string().nonempty(),
    time: z.string().nonempty(),
    continuation: z.string().nonempty().optional(),
    continuationTime: z.string().nonempty().optional(),
}).strict().transform((data) => ({ ...data, unitType: 'awardsUnit' }));

const fieldShowUnitRefSchema = z.object({
    ref: reference("schools"),
    unit: z.string().optional(),
}).strict().transform((data) => ({ ...data, unitType: 'fieldShowUnit' }));

const fieldshowLineupItemSchema = z.union([anthemPerformerSchema, awardsUnitSchema, breakUnitSchema, fieldShowUnitRefSchema]);

export const fieldShowEventSchema = z.object({
    lineup: z.array(fieldshowLineupItemSchema),
    sponsors: competitionSponsorSchema,
    start_time: z.iso.time(),
}).strict();

export type FieldShowEvent = z.infer<typeof fieldShowEventSchema>;
