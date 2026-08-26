import { NextRequest } from 'next/server';
import { BidderService } from '../../../../lib/services/bidder.service';
import { UpdateBidderSchema } from '../../../../lib/validations/bidder';
import { createSuccessResponse, createErrorResponse } from '../../../../lib/api-response';
import { z } from 'zod';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bidder = await BidderService.getBidderById(id);
    
    if (!bidder) {
      return createErrorResponse({}, 'Bidder not found', 404);
    }

    return createSuccessResponse(bidder, 'Bidder retrieved successfully');
  } catch (error: any) {
    console.error('Error fetching bidder:', error);
    return createErrorResponse({}, 'Failed to fetch bidder', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const existing = await BidderService.getBidderById(id);
    if (!existing) {
      return createErrorResponse({}, 'Bidder not found', 404);
    }

    const body = await req.json();
    const validatedData = UpdateBidderSchema.parse(body);

    const updated = await BidderService.updateBidder(id, validatedData);

    return createSuccessResponse(updated || {}, 'Bidder updated successfully');
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse((error as any).issues || (error as any).errors, 'Validation Error', 400);
    }
    const statusCode = error.statusCode || 500;
    return createErrorResponse({}, error.message || 'Failed to update bidder', statusCode);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await BidderService.getBidderById(id);
    if (!existing) {
      return createErrorResponse({}, 'Bidder not found', 404);
    }

    await BidderService.deleteBidder(id);

    return createSuccessResponse({}, 'Bidder deleted successfully', 200);
  } catch (error: any) {
    console.error('Error deleting bidder:', error);
    if (error?.code === 'P2003' || String(error).includes('constraint') || String(error).includes('foreign key')) {
      return createErrorResponse({}, 'Cannot delete bidder because it has related records', 409);
    }
    return createErrorResponse({}, 'Failed to delete bidder', 500);
  }
}
