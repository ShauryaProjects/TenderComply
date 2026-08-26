import { NextRequest } from 'next/server';
import { BidService } from '../../../../../../lib/services/bid.service';
import { UpdateBidSchema } from '../../../../../../lib/validations/bid';
import { createSuccessResponse, createErrorResponse } from '../../../../../../lib/api-response';
import { z } from 'zod';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tenderId: string; id: string }> }
) {
  try {
    const { tenderId, id } = await params;
    const bid = await BidService.getBidById(tenderId, id);
    
    if (!bid) {
      return createErrorResponse({}, 'Bid not found', 404);
    }

    return createSuccessResponse(bid, 'Bid retrieved successfully');
  } catch (error: any) {
    console.error('Error fetching bid:', error);
    return createErrorResponse({}, 'Failed to fetch bid', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tenderId: string; id: string }> }
) {
  try {
    const { tenderId, id } = await params;
    
    const existing = await BidService.getBidById(tenderId, id);
    if (!existing) {
      return createErrorResponse({}, 'Bid not found', 404);
    }

    const body = await req.json();
    const validatedData = UpdateBidSchema.parse(body);

    const updated = await BidService.updateBid(tenderId, id, validatedData);

    return createSuccessResponse(updated || {}, 'Bid updated successfully');
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse((error as any).issues || (error as any).errors, 'Validation Error', 400);
    }
    const statusCode = error.statusCode || 500;
    return createErrorResponse({}, error.message || 'Failed to update bid', statusCode);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tenderId: string; id: string }> }
) {
  try {
    const { tenderId, id } = await params;

    const existing = await BidService.getBidById(tenderId, id);
    if (!existing) {
      return createErrorResponse({}, 'Bid not found', 404);
    }

    await BidService.deleteBid(tenderId, id);

    return createSuccessResponse({}, 'Bid deleted successfully', 200);
  } catch (error: any) {
    console.error('Error deleting bid:', error);
    if (error?.code === 'P2003' || String(error).includes('constraint') || String(error).includes('foreign key')) {
      return createErrorResponse({}, 'Cannot delete bid because it has related records', 409);
    }
    return createErrorResponse({}, 'Failed to delete bid', 500);
  }
}
