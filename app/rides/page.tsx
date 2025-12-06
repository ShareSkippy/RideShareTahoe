'use client';

import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import VehicleList from '@/components/vehicles/VehicleList';

/**
 * Page for managing the user's vehicles.
 */
export default function VehicleManagementPage() {
  const { user, isLoading: authLoading } = useProtectedRoute();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <p className="text-xl text-red-500">Authentication failed. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
        <div className="mb-10 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🚙 My Vehicles
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Manage the vehicles you use for ridesharing. Add details to help passengers recognize
            your ride.
          </p>
        </div>

        <div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-6 shadow-md border border-white/20 dark:border-slate-700/30 backdrop-blur-md">
          <VehicleList />
        </div>
      </div>
    </div>
  );
}
