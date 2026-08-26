import { NextRequest } from 'next/server';
import { CreateTenderSchema, GetTendersQuerySchema } from '@/lib/validations/tender';
import { TenderService } from '@/lib/services/tender.service';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = CreateTenderSchema.parse(body);

    const tender = await TenderService.createTender(validatedData);

    return createSuccessResponse(tender || {}, 'Tender created successfully', 201);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse((error as any).issues || (error as any).errors, 'Validation Error', 400);
    }
    console.error('Error creating tender:', error);
    return createErrorResponse({}, 'Failed to create tender. The database connection might be offline.', 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    const validatedQuery = GetTendersQuerySchema.parse({ status });

    const tenders = await TenderService.getTenders(validatedQuery.status);

    return createSuccessResponse(tenders || {}, 'Tenders retrieved successfully');
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse((error as any).issues || (error as any).errors, 'Validation Error', 400);
    }
    console.error('Error fetching tenders:', error);
    return createErrorResponse({}, 'Failed to fetch tenders. The database connection might be offline.', 500);
  }
}
