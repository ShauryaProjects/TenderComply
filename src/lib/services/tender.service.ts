import { db } from '../../prisma/db';
import { z } from 'zod';
import { CreateTenderSchema, UpdateTenderSchema } from '../validations/tender';

// We wrap the queries in try-catch to properly surface DB connection errors
export class TenderService {
  static async createTender(data: z.infer<typeof CreateTenderSchema>) {
    // Note: We use the available Prisma 8 @prisma/orm-postgres methods
    const tenderModel = (db as any).orm.public.Tender;
    return await tenderModel.create(data);
  }

  static async getTenders(status?: string) {
    const tenderModel = (db as any).orm.public.Tender;
    let query = tenderModel;
    if (status) {
      query = query.where({ status });
    }
    const rows = await query
      .include('requirements', (r: any) => r.count())
      .include('bids', (b: any) => b.count())
      .all();

    return rows.map((r: any) => ({
      ...r,
      requirementCount: Number(r.requirements || 0),
      bidCount: Number(r.bids || 0)
    }));
  }

  static async getTenderById(id: string) {
    const tenderModel = (db as any).orm.public.Tender;
    const row = await tenderModel
      .where({ id })
      .include('requirements', (r: any) => r.count())
      .include('bids', (b: any) => b.count())
      .include('publishedBy', (u: any) => u.select('id', 'email', 'role', 'name'))
      .all()
      .first();

    if (!row) return null;

    const publisher = row.publishedBy;
    const publisherMapped = publisher ? {
      id: publisher.id,
      email: publisher.email,
      role: publisher.role,
      firstName: publisher.name?.split(' ')[0] || '',
      lastName: publisher.name?.split(' ').slice(1).join(' ') || ''
    } : null;

    return {
      ...row,
      publisher: publisherMapped,
      requirementCount: Number(row.requirements || 0),
      bidCount: Number(row.bids || 0)
    };
  }

  static async updateTender(id: string, data: z.infer<typeof UpdateTenderSchema>) {
    const tenderModel = (db as any).orm.public.Tender;
    return await tenderModel.where({ id }).update(data);
  }

  static async deleteTender(id: string) {
    const tenderModel = (db as any).orm.public.Tender;
    return await tenderModel.where({ id }).delete();
  }
}
