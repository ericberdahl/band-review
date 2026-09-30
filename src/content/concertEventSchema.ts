import { breakUnitSchema } from './breakUnitSchema';
import { allowEmptyArray } from './schemaUtils';
import { UnitType } from './unitTypes';

import { reference } from 'astro:content';
import { z } from 'astro/zod';

const concertUnitRefSchema = z.object({
    ref: reference("schools"),
    unit: z.string().optional(),
}).strict().transform((data) => ({ ...data, unitType: UnitType.Concert }));

const concertLineupItemSchema = z.union([concertUnitRefSchema, breakUnitSchema]);

export const concertEventSchema = z.object({
    lineup: allowEmptyArray(concertLineupItemSchema),
}).strict();

export type ConcertEvent = z.infer<typeof concertEventSchema>;
