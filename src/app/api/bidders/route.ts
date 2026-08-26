import { NextRequest } from 'next/server';
import { BidderService } from '../../../lib/services/bidder.service';
import { CreateBidderSchema } from '../../../lib/validations/bidder';
import { createSuccessResponse, createErrorResponse } from '../../../lib/api-response';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = CreateBidderSchema.parse(body);

    const bidder = await BidderService.createBidder(validatedData);

    return createSuccessResponse(bidder || {}, 'Bidder created successfully', 201);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse((error as any).issues || (error as any).errors, 'Validation Error', 400);
    }
    const statusCode = error.statusCode || 500;
    return createErrorResponse({}, error.message || 'Failed to create bidder', statusCode);
  }
}

export async function GET(req: NextRequest) {
  try {
    const bidders = await BidderService.getBidders();
    return createSuccessResponse({ data: bidders }, 'Bidders retrieved successfully');
  } catch (error: any) {
    console.error('Error fetching bidders:', error);
    return createErrorResponse({}, 'Failed to fetch bidders', 500);
  }
}
