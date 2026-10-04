import { dateTimeSchema, allowEmpty, allowEmptyArray } from './schemaUtils';
import { roleSchema } from './roleSchema';

import { z } from 'zod';

export const winterGuardUnitSchema = z.object({
    isHost: z.boolean().default(false),
    division: z.string().nonempty().optional(),    // division in which the unit is competing
    lastUpdated: dateTimeSchema,
    nickname: z.string().nonempty(),
    directors: allowEmptyArray(z.string().nonempty()),
    staff: allowEmptyArray(roleSchema),
    leaders: allowEmptyArray(roleSchema),
    program: allowEmpty("", z.string()),
    music: allowEmpty("", z.string()).optional(),
    notes: allowEmpty("", z.string()).optional(),
}).strict();

export type WinterGuardUnit = z.infer<typeof winterGuardUnitSchema>;
