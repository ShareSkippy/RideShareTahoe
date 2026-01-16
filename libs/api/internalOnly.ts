import { NextRequest, NextResponse } from 'next/server';

/**
 * Wrapper for internal-only API routes that require the x-internal-api-key header.
 * Use this for routes that should only be called by other server-side code, not by clients.
 *
 * Usage:
 * ```typescript
 * import { internalOnly } from '@/libs/api/internalOnly';
 *
 * export const POST = internalOnly(async (request) => {
 *   // Your route logic here
 * });
 * ```
 */
export function internalOnly(
  handler: (request: NextRequest) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest): Promise<NextResponse> => {
    const apiKey = request.headers.get('x-internal-api-key');
    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return handler(request);
  };
}
