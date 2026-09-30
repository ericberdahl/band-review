import { UnitType } from './unitTypes';

import { z } from 'astro/zod';

export const breakUnitSchema = z.object({
    break: z.number(),
}).strict().transform((data) => ({ ...data, unitType: UnitType.Break }));

export type BreakUnit = z.infer<typeof breakUnitSchema>;
