import { concertUnitSchema } from './concertUnitSchema';
import { fieldShowUnitSchema } from './fieldShowUnitSchema';
import { paradeUnitSchema } from './paradeUnitSchema';
import { winterGuardUnitSchema } from './winterGuardUnitSchema';
import { winterPercussionUnitSchema } from './winterPercussionUnitSchema';

import { allowEmptyArray } from './schemaUtils';

import { DateTime } from 'luxon';
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
}).catchall(unitSchema).transform((school) => {
    // Everything other than the skipped keys should be units, which then
    // need to be transformed
    const keysToSkip = ["name", "city", "staff", "students"];

    for (const key of Object.keys(school)) {
        if (!keysToSkip.includes(key)) {
            school[key].schoolName = school.name;
            school[key].city = school.city;

            school[key].lastUpdated = DateTime.fromFormat(school[key].lastUpdated, 'yyyy-MM-dd H:mm:ss Z').toISO();
        }
    }
    return school;
});

export type School = z.infer<typeof schoolSchema>;
