import { z } from 'zod';

export const TenderStatusEnum = z.enum([
  'DRAFT',
  'PUBLISHED',
  'CLOSED',
  'EVALUATION',
  'AWARDED',
  'CANCELLED'
]);

export const CreateTenderSchema = z.object({
  tenderReference: z.string().min(1, "tenderReference is required"),
  title: z.string().min(1, "title is required"),
  description: z.string().optional(),
  status: TenderStatusEnum.default('DRAFT'),
  publishedById: z.string().uuid("publishedById must be a valid UUID")
});

export const UpdateTenderSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: TenderStatusEnum.optional()
});

export const GetTendersQuerySchema = z.object({
  status: TenderStatusEnum.optional()
});
