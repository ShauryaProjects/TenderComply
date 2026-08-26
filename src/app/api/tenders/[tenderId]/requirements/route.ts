import { NextRequest } from 'next/server';
import { CreateRequirementSchema } from '@/lib/validations/requirement';
import { RequirementService } from '@/lib/services/requirement.service';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

type RouteParams = { params: Promise<{ tenderId: string }> };

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { tenderId } = await params;
    const body = await req.json();
    const validatedData = CreateRequirementSchema.parse(body);

    const requirement = await RequirementService.createRequirement(tenderId, validatedData);

    return createSuccessResponse(requirement || {}, 'Requirement created successfully', 201);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse((error as any).issues || (error as any).errors, 'Validation Error', 400);
    }
    const statusCode = error.statusCode || 500;
    return createErrorResponse({}, error.message || 'Failed to create requirement', statusCode);
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { tenderId } = await params;
    const requirements = await RequirementService.getRequirementsByTenderId(tenderId);

    return createSuccessResponse(requirements || [], 'Requirements retrieved successfully');
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return createErrorResponse({}, error.message || 'Failed to fetch requirements', statusCode);
  }
}
