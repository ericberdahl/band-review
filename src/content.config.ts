import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { bandReviewSchema } from './content/bandReviewSchema';
import { schoolSchema } from './content/schoolSchema';

//======================================

export const schools = defineCollection({
    loader: glob({ pattern: "*.yml", base: "./schools/" }),
    schema: schoolSchema,
});

export const bandReview = defineCollection({
    loader: glob({ pattern: "band-review.yml", base: "./source/" }),
    schema: bandReviewSchema,
});

export const collections = { bandReview, schools }