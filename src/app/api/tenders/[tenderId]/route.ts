import { NextRequest } from 'next/server';
import { UpdateTenderSchema } from '@/lib/validations/tender';
import { TenderService } from '@/lib/services/tender.service';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

type RouteParams = { params: Promise<{ tenderId: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { tenderId } = await params;

    const tender = await TenderService.getTenderById(tenderId);

    if (!tender) {
      return createErrorResponse({}, 'Tender not found', 404);
    }

    return createSuccessResponse(tender, 'Tender retrieved successfully');
  } catch (error) {
    console.error('Error fetching tender:', error);

    return createErrorResponse(
      {},
      'Failed to fetch tender. The database connection might be offline.',
      500
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { tenderId } = await params;

    const existing = await TenderService.getTenderById(tenderId);

    if (!existing) {
      return createErrorResponse({}, 'Tender not found', 404);
    }

    const body = await req.json();
    const validatedData = UpdateTenderSchema.parse(body);

    const updated = await TenderService.updateTender(
      tenderId,
      validatedData
    );

    return createSuccessResponse(
      updated || {},
      'Tender updated successfully'
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(
        error.issues,
        'Validation Error',
        400
      );
    }

    console.error('Error updating tender:', error);

    return createErrorResponse(
      {},
      'Failed to update tender',
      500
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { tenderId } = await params;

    const existing = await TenderService.getTenderById(tenderId);

    if (!existing) {
      return createErrorResponse({}, 'Tender not found', 404);
    }

    await TenderService.deleteTender(tenderId);

    return createSuccessResponse(
      {},
      'Tender deleted successfully',
      200
    );
  } catch (error: any) {
    console.error('Error deleting tender:', error);

    if (
      error?.code === 'P2003' ||
      String(error).includes('constraint') ||
      String(error).includes('foreign key')
    ) {
      return createErrorResponse(
        {},
        'Conflict: Tender cannot be deleted due to associated records',
        409
      );
    }

    return createErrorResponse(
      {},
      'Failed to delete tender',
      500
    );
  }
}