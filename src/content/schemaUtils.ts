import { z } from 'zod';

export function allowEmpty(defaultValue: any, schema: z.ZodTypeAny) {
    return z.preprocess((val) => (val == null ? defaultValue : val), schema);
}

export function allowEmptyArray(schema: z.ZodTypeAny) {
    return allowEmpty([], z.array(schema));
}

export const dateTimeSchema = z.string().nonempty().regex(
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{2}$/,
    { message: "Invalid datetime format. Expected YYYY-MM-DD HH:MM:SS -TT" }
);
