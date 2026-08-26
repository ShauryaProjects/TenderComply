import { z } from 'zod';

export const BidStatusEnum = z.enum([
  'SUBMITTED',
  'UNDER_REVIEW',
  'COMPLIANT',
  'NON_COMPLIANT',
  'DISQUALIFIED'
]);

export const CreateBidSchema = z.object({
  bidderId: z.string().uuid("Invalid bidder ID"),
  status: BidStatusEnum.default('SUBMITTED'),
  submissionDate: z.string().datetime().optional()
});

export const UpdateBidSchema = z.object({
  status: BidStatusEnum.optional(),
  submissionDate: z.string().datetime().optional()
});
