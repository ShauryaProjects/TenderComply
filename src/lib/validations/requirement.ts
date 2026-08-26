import { z } from 'zod';

export const RequirementCategoryEnum = z.enum([
  'FINANCIAL',
  'TECHNICAL',
  'EXPERIENCE',
  'STATUTORY'
]);

export const CreateRequirementSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: RequirementCategoryEnum,
  isMandatory: z.boolean().default(true),
  validationRules: z.record(z.string(), z.any()).default({})
});

export const UpdateRequirementSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: RequirementCategoryEnum.optional(),
  isMandatory: z.boolean().optional(),
  validationRules: z.record(z.string(), z.any()).optional()
});
