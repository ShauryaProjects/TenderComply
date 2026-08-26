import { Temporal } from '@js-temporal/polyfill';
import { db } from '../../prisma/db';
import { z } from 'zod';
import { CreateBidSchema, UpdateBidSchema } from '../validations/bid';

export class BidService {
  static async createBid(tenderId: string, data: z.infer<typeof CreateBidSchema>) {
    const bidModel = (db as any).orm.public.Bid;
    const tenderModel = (db as any).orm.public.Tender;
    const bidderModel = (db as any).orm.public.Bidder;

    // Check if tender exists
    const tender = await tenderModel.where({ id: tenderId }).first();
    if (!tender) {
      const error: any = new Error('Tender not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if bidder exists
    const bidder = await bidderModel.where({ id: data.bidderId }).first();
    if (!bidder) {
      const error: any = new Error('Bidder not found');
      error.statusCode = 404;
      throw error;
    }

    // Check unique [tenderId, bidderId]
    const existing = await bidModel.where({ tenderId, bidderId: data.bidderId }).first();
    if (existing) {
      const error: any = new Error('This bidder has already submitted a bid for this tender');
      error.statusCode = 409;
      throw error;
    }

    try {
     return await bidModel.create({
  ...data,
  ...(data.submissionDate
    ? { submissionDate: Temporal.Instant.from(data.submissionDate) }
    : {}),
  tenderId
});
    } catch (dbError: any) {
      if (dbError?.code === 'P2002' || String(dbError).includes('unique constraint')) {
        const error: any = new Error('This bidder has already submitted a bid for this tender');
        error.statusCode = 409;
        throw error;
      }
      throw dbError;
    }
  }

  static async getBidsByTenderId(tenderId: string) {
    const bidModel = (db as any).orm.public.Bid;
    const tenderModel = (db as any).orm.public.Tender;

    const tender = await tenderModel.where({ id: tenderId }).first();
    if (!tender) {
      const error: any = new Error('Tender not found');
      error.statusCode = 404;
      throw error;
    }

    return await bidModel.where({ tenderId }).all();
  }

  static async getBidById(tenderId: string, id: string) {
    const bidModel = (db as any).orm.public.Bid;
    return await bidModel.where({ id, tenderId }).first();
  }

  static async updateBid(tenderId: string, id: string, data: z.infer<typeof UpdateBidSchema>) {
    const bidModel = (db as any).orm.public.Bid;

    try {
      return await bidModel.where({ id, tenderId }).update(data);
    } catch (dbError: any) {
      throw dbError;
    }
  }

  static async deleteBid(tenderId: string, id: string) {
    const bidModel = (db as any).orm.public.Bid;
    return await bidModel.where({ id, tenderId }).delete();
  }
}
