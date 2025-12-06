'use client';

import Link from 'next/link';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useUserProfile } from '@/hooks/useProfile';
import ProfileForm from './ProfileForm';

/**
 * Renders the authenticated user's profile edit form along with helper actions.
 * This is a protected route - unauthenticated users will be redirected to login.
 */
export default function ProfileEditPage() {
  const { user, isLoading: authLoading } = useProtectedRoute();
  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile();

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 dark:text-slate-300">Loading profile editor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // useProtectedRoute handles redirect
  }

  if (profileError) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="max-w-md rounded-xl bg-white/80 dark:bg-slate-900/90 px-6 py-8 shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">
            Unable to load profile
          </h2>
          <p className="text-gray-600 dark:text-slate-300">
            {profileError.message || 'Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-6 py-10 px-4 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
            Profile
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-50">
              Edit Your Profile
            </h1>
            <Link
              href="/profile"
              className="rounded-full border border-blue-200 dark:border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              Back to Profile
            </Link>
          </div>
        </header>

        <ProfileForm initialData={profile || {}} />
      </div>
    </div>
  );
}
