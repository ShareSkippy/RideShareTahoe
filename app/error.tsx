'use client';

/**
 * Global error boundary component.
 * Catches unhandled errors in client components.
 */
export default function ErrorBoundary({ reset }: { readonly reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Try again
      </button>
    </div>
  );
}
