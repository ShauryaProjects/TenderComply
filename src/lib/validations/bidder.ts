import { z } from 'zod';

export const CreateBidderSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  panNumber: z.string().optional(),
  gstNumber: z.string().optional(),
  dateOfIncorporation: z.string().datetime().optional()
});

export const UpdateBidderSchema = z.object({
  companyName: z.string().min(1).optional(),
  panNumber: z.string().optional(),
  gstNumber: z.string().optional(),
  dateOfIncorporation: z.string().datetime().optional()
});
