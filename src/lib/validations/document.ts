import { z } from 'zod';

export const DocumentTypeEnum = z.enum([
  'PAN_CARD',
  'GST_CERTIFICATE',
  'ITR',
  'EXPERIENCE_CERT',
  'MSME_CERT',
  'ISO_CERT',
  'OTHER'
]);

export const CreateDocumentSchema = z.object({
  documentType: DocumentTypeEnum,
  fileUrl: z.string().url("Invalid file URL"),
  uploadedAt: z.string().datetime().optional()
});

export const UpdateDocumentSchema = z.object({
  documentType: DocumentTypeEnum.optional(),
  fileUrl: z.string().url("Invalid file URL").optional(),
  uploadedAt: z.string().datetime().optional()
});
