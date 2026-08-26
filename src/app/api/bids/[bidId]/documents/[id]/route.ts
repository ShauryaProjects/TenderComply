import { NextRequest } from 'next/server';
import { DocumentService } from '../../../../../../lib/services/document.service';
import { UpdateDocumentSchema } from '../../../../../../lib/validations/document';
import { createSuccessResponse, createErrorResponse } from '../../../../../../lib/api-response';
import { z } from 'zod';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bidId: string; id: string }> }
) {
  try {
    const { bidId, id } = await params;
    const document = await DocumentService.getDocumentById(bidId, id);
    
    if (!document) {
      return createErrorResponse({}, 'Document not found', 404);
    }

    return createSuccessResponse(document, 'Document retrieved successfully');
  } catch (error: any) {
    console.error('Error fetching document:', error);
    return createErrorResponse({}, 'Failed to fetch document', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ bidId: string; id: string }> }
) {
  try {
    const { bidId, id } = await params;
    
    const existing = await DocumentService.getDocumentById(bidId, id);
    if (!existing) {
      return createErrorResponse({}, 'Document not found', 404);
    }

    const body = await req.json();
    const validatedData = UpdateDocumentSchema.parse(body);

    const updated = await DocumentService.updateDocument(bidId, id, validatedData);

    return createSuccessResponse(updated || {}, 'Document updated successfully');
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse((error as any).issues || (error as any).errors, 'Validation Error', 400);
    }
    const statusCode = error.statusCode || 500;
    return createErrorResponse({}, error.message || 'Failed to update document', statusCode);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ bidId: string; id: string }> }
) {
  try {
    const { bidId, id } = await params;

    const existing = await DocumentService.getDocumentById(bidId, id);
    if (!existing) {
      return createErrorResponse({}, 'Document not found', 404);
    }

    await DocumentService.deleteDocument(bidId, id);

    return createSuccessResponse({}, 'Document deleted successfully', 200);
  } catch (error: any) {
    console.error('Error deleting document:', error);
    if (error?.code === 'P2003' || String(error).includes('constraint') || String(error).includes('foreign key')) {
      return createErrorResponse({}, 'Cannot delete document because it has related records', 409);
    }
    return createErrorResponse({}, 'Failed to delete document', 500);
  }
}
