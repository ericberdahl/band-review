import { dateTimeSchema, allowEmpty, allowEmptyArray } from './schemaUtils';
import { roleSchema } from './roleSchema';

import { z } from 'zod';

export const paradeUnitSchema = z.object({
    isHost: z.boolean().default(false),
    lastUpdated: dateTimeSchema,
    nickname: z.string().nonempty(),
    directors: allowEmptyArray(z.string().nonempty()),
    staff: allowEmptyArray(roleSchema).optional(),
    leaders: allowEmptyArray(roleSchema),
    music: allowEmpty("", z.string()),
    notes: allowEmpty("", z.string().optional()),
}).strict();

export type ParadeUnit = z.infer<typeof paradeUnitSchema>;
