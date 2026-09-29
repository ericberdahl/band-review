import { dateTimeSchema, allowEmpty, allowEmptyArray } from './schemaUtils';
import { roleSchema } from './roleSchema';

import { z } from 'zod';

export const fieldShowUnitSchema = z.object({
    isHost: z.boolean().default(false),
    lastUpdated: dateTimeSchema,
    nickname: z.string().nonempty(),
    directors: allowEmptyArray(z.string().nonempty()),
    staff: allowEmptyArray(roleSchema).optional(),
    leaders: allowEmptyArray(roleSchema),
    program: allowEmpty("", z.string()),
    music: allowEmpty("", z.string()).optional(),
    description: allowEmpty("", z.string()).optional(),
    notes: allowEmpty("", z.string()).optional(),
}).strict();

export type FieldShowUnit = z.infer<typeof fieldShowUnitSchema>;
