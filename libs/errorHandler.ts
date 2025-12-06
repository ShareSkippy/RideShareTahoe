export class APIError extends Error {
  statusCode: number;
  code: string | null;

  constructor(message: string, statusCode: number = 500, code: string | null = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

interface ErrorLike {
  message?: string;
  stack?: string;
  code?: string | null;
  statusCode?: number;
}

export const handleAPIError = (err: unknown, request: Request) => {
  const error = err as ErrorLike;
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
  });

  // Handle known error types
  if (error instanceof APIError) {
    return {
      error: error.message,
      code: error.code,
      status: error.statusCode,
    };
  }

  // Handle Supabase errors
  if (error.code && error.message) {
    return {
      error: error.message,
      code: error.code,
      status: 400,
    };
  }

  // Handle validation errors
  if (error.message?.includes('Validation failed')) {
    return {
      error: error.message,
      status: 400,
    };
  }

  // Handle authentication errors
  if (error.message?.includes('Unauthorized')) {
    return {
      error: 'Authentication required',
      status: 401,
    };
  }

  // Handle rate limiting errors
  if (error.message?.includes('Too many requests')) {
    return {
      error: error.message,
      status: 429,
    };
  }

  // Default error
  return {
    error: 'Internal server error',
    status: 500,
  };
};

export const withErrorHandling = <TContext>(
  // eslint-disable-next-line no-unused-vars
  handler: (req: Request, ctx: TContext) => Promise<Response>
) => {
  return async (request: Request, context: TContext) => {
    try {
      return await handler(request, context);
    } catch (error) {
      const errorResponse = handleAPIError(error, request);

      return new Response(
        JSON.stringify({
          error: errorResponse.error,
          code: errorResponse.code,
          timestamp: new Date().toISOString(),
        }),
        {
          status: errorResponse.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  };
};

// Common error responses
export const createErrorResponse = (
  message: string,
  status: number = 500,
  code: string | null = null
) => {
  return new Response(
    JSON.stringify({
      error: message,
      code,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

export const createSuccessResponse = (data: unknown, status: number = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
