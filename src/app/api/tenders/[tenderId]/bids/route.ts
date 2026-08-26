import { NextRequest } from 'next/server';
import { BidService } from '../../../../../lib/services/bid.service';
import { CreateBidSchema } from '../../../../../lib/validations/bid';
import { createSuccessResponse, createErrorResponse } from '../../../../../lib/api-response';
import { z } from 'zod';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenderId: string }> }
) {
  try {
    const { tenderId } = await params;
    const body = await req.json();
    const validatedData = CreateBidSchema.parse(body);

    const bid = await BidService.createBid(tenderId, validatedData);

    return createSuccessResponse(bid || {}, 'Bid created successfully', 201);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse((error as any).issues || (error as any).errors, 'Validation Error', 400);
    }
    const statusCode = error.statusCode || 500;
    return createErrorResponse({}, error.message || 'Failed to create bid', statusCode);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tenderId: string }> }
) {
  try {
    const { tenderId } = await params;
    const bids = await BidService.getBidsByTenderId(tenderId);
    return createSuccessResponse({ data: bids }, 'Bids retrieved successfully');
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return createErrorResponse({}, error.message || 'Failed to fetch bids', statusCode);
  }
}
