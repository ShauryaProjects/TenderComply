import { db } from '../../prisma/db';
import { z } from 'zod';
import { Temporal } from '@js-temporal/polyfill';
import { CreateDocumentSchema, UpdateDocumentSchema } from '../validations/document';

export class DocumentService {
 static async createDocument(
  bidId: string,
  data: z.infer<typeof CreateDocumentSchema>
) {
  const documentModel = (db as any).orm.public.Document;
  const bidModel = (db as any).orm.public.Bid;

  // Check if bid exists
  const bid = await bidModel.where({ id: bidId }).first();

  if (!bid) {
    const error: any = new Error('Bid not found');
    error.statusCode = 404;
    throw error;
  }

  try {
    const document = await documentModel.create({
      ...data,
      bidId,
      uploadedAt: data.uploadedAt
        ? Temporal.Instant.from(data.uploadedAt)
        : Temporal.Now.instant(),
    });

    return document;
  } catch (dbError: any) {
    console.error('Error creating document:', dbError);
    throw dbError;
  }
}

  static async getDocumentsByBidId(bidId: string) {
    const documentModel = (db as any).orm.public.Document;
    const bidModel = (db as any).orm.public.Bid;

    const bid = await bidModel.where({ id: bidId }).first();
    if (!bid) {
      const error: any = new Error('Bid not found');
      error.statusCode = 404;
      throw error;
    }

    return await documentModel.where({ bidId }).all();
  }

  static async getDocumentById(bidId: string, id: string) {
    const documentModel = (db as any).orm.public.Document;
    return await documentModel.where({ id, bidId }).first();
  }

  static async updateDocument(bidId: string, id: string, data: z.infer<typeof UpdateDocumentSchema>) {
    const documentModel = (db as any).orm.public.Document;

    try {
      return await documentModel.where({ id, bidId }).update(data);
    } catch (dbError: any) {
      throw dbError;
    }
  }

  static async deleteDocument(bidId: string, id: string) {
    const documentModel = (db as any).orm.public.Document;
    return await documentModel.where({ id, bidId }).delete();
  }
}
