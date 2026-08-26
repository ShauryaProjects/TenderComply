import { db } from '../../prisma/db';
import { z } from 'zod';
import { CreateBidderSchema, UpdateBidderSchema } from '../validations/bidder';

export class BidderService {
  static async createBidder(data: z.infer<typeof CreateBidderSchema>) {
    const bidderModel = (db as any).orm.public.Bidder;

    // Check unique panNumber
    if (data.panNumber) {
      const existingPan = await bidderModel.where({ panNumber: data.panNumber }).first();
      if (existingPan) {
        const error: any = new Error('A bidder with this PAN number already exists');
        error.statusCode = 409;
        throw error;
      }
    }

    // Check unique gstNumber
    if (data.gstNumber) {
      const existingGst = await bidderModel.where({ gstNumber: data.gstNumber }).first();
      if (existingGst) {
        const error: any = new Error('A bidder with this GST number already exists');
        error.statusCode = 409;
        throw error;
      }
    }

    try {
      return await bidderModel.create(data);
    } catch (dbError: any) {
      if (dbError?.code === 'P2002' || String(dbError).includes('unique constraint')) {
        const error: any = new Error('A unique constraint violation occurred (PAN or GST already exists)');
        error.statusCode = 409;
        throw error;
      }
      throw dbError;
    }
  }

  static async getBidders() {
    const bidderModel = (db as any).orm.public.Bidder;
    return await bidderModel.all();
  }

  static async getBidderById(id: string) {
    const bidderModel = (db as any).orm.public.Bidder;
    return await bidderModel.where({ id }).first();
  }

  static async updateBidder(id: string, data: z.infer<typeof UpdateBidderSchema>) {
    const bidderModel = (db as any).orm.public.Bidder;

    if (data.panNumber) {
      const existingPan = await bidderModel.where({ panNumber: data.panNumber }).first();
      if (existingPan && existingPan.id !== id) {
        const error: any = new Error('A bidder with this PAN number already exists');
        error.statusCode = 409;
        throw error;
      }
    }

    if (data.gstNumber) {
      const existingGst = await bidderModel.where({ gstNumber: data.gstNumber }).first();
      if (existingGst && existingGst.id !== id) {
        const error: any = new Error('A bidder with this GST number already exists');
        error.statusCode = 409;
        throw error;
      }
    }

    try {
      return await bidderModel.where({ id }).update(data);
    } catch (dbError: any) {
      if (dbError?.code === 'P2002' || String(dbError).includes('unique constraint')) {
        const error: any = new Error('A unique constraint violation occurred (PAN or GST already exists)');
        error.statusCode = 409;
        throw error;
      }
      throw dbError;
    }
  }

  static async deleteBidder(id: string) {
    const bidderModel = (db as any).orm.public.Bidder;
    return await bidderModel.where({ id }).delete();
  }
}
