import { breakUnitSchema } from './breakUnitSchema';
import { competitionSponsorSchema } from './sponsorSchemas';
import { UnitType } from './unitTypes';

import { reference } from 'astro:content';
import { z } from 'astro/zod';

const colorsUnitSchema = z.object({
    colors: z.string(),
}).strict().transform((data) => ({ ...data, unitType: UnitType.PresentationOfColors }));

const grandMarshalUnitSchema = z.object({
    grandMarshal: z.union([z.string(), z.array(z.string())]),
    title: z.string().optional(),
}).strict().transform((data) => ({ ...data, unitType: UnitType.GrandMarshal }));

const paradeUnitRefSchema = z.object({
    ref: reference("schools"),
    unit: z.string().optional(),
}).strict().transform((data) => ({ ...data, unitType: UnitType.Parade }));

const paradeLineupItemSchema = z.union([paradeUnitRefSchema, breakUnitSchema, colorsUnitSchema, grandMarshalUnitSchema]);

export const paradeEventSchema = z.object({
    awards_location: z.string(),
    awards_time: z.iso.time(),
    lineup: z.array(paradeLineupItemSchema),
    sponsors: competitionSponsorSchema,
});

export type ParadeEvent = z.infer<typeof paradeEventSchema>;
