import { z } from 'astro/zod';

export const breakUnitSchema = z.object({
    break: z.number(),
}).strict().transform((data) => ({ ...data, unitType: 'breakUnit' }));
