import { dateTimeSchema, allowEmpty, allowEmptyArray } from './schemaUtils';
import { roleSchema } from './roleSchema';

import { z } from 'zod';

export const concertUnitSchema = z.object({
    lastUpdated: dateTimeSchema,
    nickname: z.string().nonempty().optional(),
}).strict();

export type ConcertUnit = z.infer<typeof concertUnitSchema>;
