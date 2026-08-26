import { db } from '../../prisma/db';
import { z } from 'zod';
import { CreateRequirementSchema, UpdateRequirementSchema } from '../validations/requirement';

export class RequirementService {
  static async createRequirement(tenderId: string, data: z.infer<typeof CreateRequirementSchema>) {
    const requirementModel = (db as any).orm.public.Requirement;
    const tenderModel = (db as any).orm.public.Tender;

    // Check if tender exists
    const tender = await tenderModel.where({ id: tenderId }).first();
    if (!tender) {
      const error: any = new Error('Tender not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if requirement with the same name already exists in this tender
    const existing = await requirementModel.where({ tenderId, name: data.name }).first();
    if (existing) {
      const error: any = new Error('A requirement with this name already exists for this tender');
      error.statusCode = 409;
      throw error;
    }

    try {
      return await requirementModel.create({
        ...data,
        tenderId
      });
    } catch (dbError: any) {
      if (dbError?.code === 'P2002' || String(dbError).includes('unique constraint')) {
        const error: any = new Error('A requirement with this name already exists for this tender');
        error.statusCode = 409;
        throw error;
      }
      throw dbError;
    }
  }

  static async getRequirementsByTenderId(tenderId: string) {
    const requirementModel = (db as any).orm.public.Requirement;
    const tenderModel = (db as any).orm.public.Tender;

    // Check if tender exists
    const tender = await tenderModel.where({ id: tenderId }).first();
    if (!tender) {
      const error: any = new Error('Tender not found');
      error.statusCode = 404;
      throw error;
    }

    return await requirementModel.where({ tenderId }).all();
  }

  static async getRequirementById(tenderId: string, id: string) {
    const requirementModel = (db as any).orm.public.Requirement;
    return await requirementModel.where({ id, tenderId }).first();
  }

  static async updateRequirement(tenderId: string, id: string, data: z.infer<typeof UpdateRequirementSchema>) {
    const requirementModel = (db as any).orm.public.Requirement;

    // If name is updated, check for duplicate name
    if (data.name) {
      const existingName = await requirementModel.where({ tenderId, name: data.name }).first();
      if (existingName && existingName.id !== id) {
        const error: any = new Error('A requirement with this name already exists for this tender');
        error.statusCode = 409;
        throw error;
      }
    }

    try {
      return await requirementModel.where({ id, tenderId }).update(data);
    } catch (dbError: any) {
      if (dbError?.code === 'P2002' || String(dbError).includes('unique constraint')) {
        const error: any = new Error('A requirement with this name already exists for this tender');
        error.statusCode = 409;
        throw error;
      }
      throw dbError;
    }
  }

  static async deleteRequirement(tenderId: string, id: string) {
    const requirementModel = (db as any).orm.public.Requirement;
    return await requirementModel.where({ id, tenderId }).delete();
  }
}
