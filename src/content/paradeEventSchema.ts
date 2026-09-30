import { breakUnitSchema } from './breakUnitSchema';
import { competitionSponsorSchema } from './sponsorSchemas';
import { UnitType } from './unitTypes';

import { reference } from 'astro:content';
import { z } from 'astro/zod';

const colorsUnitSchema = z.object({
    colors: z.string(),
}).strict().transform((data) => ({ ...data, unitType: UnitType.PresentationOfColors }));

export type ColorsUnit = z.infer<typeof colorsUnitSchema>;

const grandMarshalUnitSchema = z.object({
    grandMarshal: z.union([z.string(), z.array(z.string())]),
    title: z.string().optional(),
}).strict().transform((data) => ({
    title: data.title || "Grand Marshal",
    grandMarshal: Array.isArray(data.grandMarshal) ? data.grandMarshal : [data.grandMarshal],
    unitType: UnitType.GrandMarshal,
}));

export type GrandMarshalUnit = z.infer<typeof grandMarshalUnitSchema>;

const paradeUnitRefSchema = z.object({
    ref: reference("schools"),
    unit: z.string().optional(),
}).strict().transform((data) => ({ ...data, unitType: UnitType.Parade }));

export type ParadeUnitRef = z.infer<typeof paradeUnitRefSchema>;

const paradeLineupItemSchema = z.union([paradeUnitRefSchema, breakUnitSchema, colorsUnitSchema, grandMarshalUnitSchema]);

export type ParadeLineupItem = z.infer<typeof paradeLineupItemSchema>;

export const paradeEventSchema = z.object({
    awardsLocation: z.string(),
    awardsTime: z.iso.time(),
    startTime: z.iso.time(),
    lineup: z.array(paradeLineupItemSchema),
    sponsors: competitionSponsorSchema,
}).strict();

export type ParadeEvent = z.infer<typeof paradeEventSchema>;
