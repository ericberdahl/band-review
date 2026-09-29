import { concertUnitSchema } from './concertUnitSchema';
import { fieldShowUnitSchema } from './fieldShowUnitSchema';
import { paradeUnitSchema } from './paradeUnitSchema';
import { winterGuardUnitSchema } from './winterGuardUnitSchema';
import { winterPercussionUnitSchema } from './winterPercussionUnitSchema';

import { allowEmptyArray } from './schemaUtils';

import { z } from 'zod';

const unitSchema = z.union([
    paradeUnitSchema,
    fieldShowUnitSchema,
    concertUnitSchema,
    winterGuardUnitSchema,
    winterPercussionUnitSchema
]);

export const schoolSchema = z.object({
    name: z.string().nonempty(),
    city: z.string().nonempty(),
    staff: allowEmptyArray(z.string().nonempty()).optional(),
    students: allowEmptyArray(z.string().nonempty()).optional(),
    parade: paradeUnitSchema.optional(),
    fieldshow: fieldShowUnitSchema.optional(),
    concert: concertUnitSchema.optional(),
    winterguard: winterGuardUnitSchema.optional(),
    winterpercussion: winterPercussionUnitSchema.optional(),
}).catchall(unitSchema);

export type School = z.infer<typeof schoolSchema>;
