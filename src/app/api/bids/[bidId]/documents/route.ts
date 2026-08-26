import { NextRequest } from 'next/server';
import { DocumentService } from '../../../../../lib/services/document.service';
import { CreateDocumentSchema } from '../../../../../lib/validations/document';
import { createSuccessResponse, createErrorResponse } from '../../../../../lib/api-response';
import { z } from 'zod';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ bidId: string }> }
) {
  try {
    const { bidId } = await params;
    const body = await req.json();
    const validatedData = CreateDocumentSchema.parse(body);

    const document = await DocumentService.createDocument(bidId, validatedData);

    return createSuccessResponse(document || {}, 'Document created successfully', 201);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse((error as any).issues || (error as any).errors, 'Validation Error', 400);
    }
    const statusCode = error.statusCode || 500;
    return createErrorResponse({}, error.message || 'Failed to create document', statusCode);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bidId: string }> }
) {
  try {
    const { bidId } = await params;
    const documents = await DocumentService.getDocumentsByBidId(bidId);
    return createSuccessResponse({ data: documents }, 'Documents retrieved successfully');
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return createErrorResponse({}, error.message || 'Failed to fetch documents', statusCode);
  }
}
