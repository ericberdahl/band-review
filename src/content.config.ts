import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { bandReviewSchema } from './content/bandReviewSchema';
import { schoolSchema } from './content/schoolSchema';

//====================================== temp section for wintershow schema

import { reference } from 'astro:content';
import { z } from 'zod';

import { announcerSchema } from './content/announcerSchema';
import { breakUnitSchema } from './content/breakUnitSchema';
import { competitionSponsorSchema } from './content/sponsorSchemas';
import { showCitationSchema } from './content/showCitationSchema';
import { UnitType } from './content/unitTypes';

export const winterGuardUnitRefSchema = z.object({
    ref: reference("schools"),
    unit: z.string().optional(),
}).strict().transform((data) => ({ ...data, unitType: UnitType.WinterGuard }));

export type WinterGuardUnitRef = z.infer<typeof winterGuardUnitRefSchema>;

export const winterGuardLineupItemSchema = z.union([winterGuardUnitRefSchema, breakUnitSchema]);

export type WinterGuardLineupItem = z.infer<typeof winterGuardLineupItemSchema>;

export const winterGuardEventSchema = z.object({
    lineup: z.array(winterGuardLineupItemSchema),
    sponsors: competitionSponsorSchema,
    startTime: z.iso.time(),
}).strict();

export type WinterGuardEvent = z.infer<typeof winterGuardEventSchema>;

export const winterPercussionUnitRefSchema = z.object({
    ref: reference("schools"),
    unit: z.string().optional(),
}).strict().transform((data) => ({ ...data, unitType: UnitType.WinterPercussion }));

export type WinterPercussionUnitRef = z.infer<typeof winterPercussionUnitRefSchema>;

export const winterPercussionLineupItemSchema = z.union([winterPercussionUnitRefSchema, breakUnitSchema]);

export type WinterPercussionLineupItem = z.infer<typeof winterPercussionLineupItemSchema>;

export const winterPercussionEventSchema = z.object({
    lineup: z.array(winterPercussionLineupItemSchema),
    sponsors: competitionSponsorSchema,
    startTime: z.iso.time(),
}).strict();

export type WinterPercussionEvent = z.infer<typeof winterPercussionEventSchema>;

export const winterShowSchema = z.object({
    announcer: announcerSchema,
    version: z.string(),
    show: showCitationSchema,
    nextShow: showCitationSchema,
    units: z.array(z.string()),
    winterGuard: winterGuardEventSchema,
    winterPercussion: winterPercussionEventSchema,

});

export type WinterShow = z.infer<typeof winterShowSchema>;

//======================================

export const schools = defineCollection({
    loader: glob({ pattern: "*.yml", base: "./schools/" }),
    schema: schoolSchema,
});

export const bandReview = defineCollection({
    loader: glob({ pattern: "band-review.yml", base: "./source/" }),
    schema: bandReviewSchema,
});

export const winterShow = defineCollection({
    loader: glob({ pattern: "winter-show.yml", base: "./source/" }),
    schema: winterShowSchema,
});

export const collections = { bandReview, winterShow, schools }