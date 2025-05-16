import { z } from 'zod';
import { passageCreateSchema } from 'src/validators/passage';

export type PassageCreateInput = z.infer<typeof passageCreateSchema>;
