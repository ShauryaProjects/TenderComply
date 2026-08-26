import { NextRequest } from 'next/server';
import { UpdateRequirementSchema } from '@/lib/validations/requirement';
import { RequirementService } from '@/lib/services/requirement.service';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

type RouteParams = { params: Promise<{ tenderId: string; id: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { tenderId, id } = await params;

    const requirement = await RequirementService.getRequirementById(tenderId, id);
    if (!requirement) {
      return createErrorResponse({}, 'Requirement not found', 404);
    }

    return createSuccessResponse(requirement, 'Requirement retrieved successfully');
  } catch (error) {
    console.error('Error fetching requirement:', error);
    return createErrorResponse({}, 'Failed to fetch requirement', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { tenderId, id } = await params;

    const existing = await RequirementService.getRequirementById(tenderId, id);
    if (!existing) {
      return createErrorResponse({}, 'Requirement not found', 404);
    }

    const body = await req.json();
    const validatedData = UpdateRequirementSchema.parse(body);

    const updated = await RequirementService.updateRequirement(tenderId, id, validatedData);

    return createSuccessResponse(updated || {}, 'Requirement updated successfully');
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse((error as any).issues || (error as any).errors, 'Validation Error', 400);
    }
    const statusCode = error.statusCode || 500;
    return createErrorResponse({}, error.message || 'Failed to update requirement', statusCode);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { tenderId, id } = await params;

    const existing = await RequirementService.getRequirementById(tenderId, id);
    if (!existing) {
      return createErrorResponse({}, 'Requirement not found', 404);
    }

    await RequirementService.deleteRequirement(tenderId, id);

    return createSuccessResponse({}, 'Requirement deleted successfully', 200);
  } catch (error: any) {
    console.error('Error deleting requirement:', error);
    if (error?.code === 'P2003' || String(error).includes('constraint') || String(error).includes('foreign key')) {
      return createErrorResponse({}, 'Conflict: Requirement cannot be deleted due to associated records', 409);
    }
    return createErrorResponse({}, 'Failed to delete requirement', 500);
  }
}
