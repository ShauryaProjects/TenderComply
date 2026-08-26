import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Verify database client is initialized
    if (!db) {
      throw new Error('Database client not initialized');
    }

    return createSuccessResponse({
      service: 'TenderComply API',
      status: 'healthy',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      'Health check failed',
      503
    );
  }
}
