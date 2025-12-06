'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUserProfile } from '@/hooks/useProfile';

export default function CompleteProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    // If profile exists and has a first name, redirect to community page
    if (!isLoading && profile?.first_name) {
      router.push('/community');
    }
  }, [profile, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
          <span className="text-4xl">👋</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to RideShare Tahoe!
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-lg">
          To join our community of drivers and passengers, we need you to set up your profile first.
        </p>

        <div className="pt-4">
          <Link
            href="/profile/edit"
            className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Set up Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
