import Link from 'next/link';

/**
 * Global 404 Not Found component.
 * Renders a friendly error message when a page is not found.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl mb-4">🏔️</div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you&apos;ve ventured off-trail. Let&apos;s get you back to the main road.
        </p>
        <Link
          href="/"
          className="inline-block bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
