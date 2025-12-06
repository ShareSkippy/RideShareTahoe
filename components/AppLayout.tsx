'use client';

import { usePathname } from 'next/navigation';
import React, { useState, useCallback } from 'react';
import { useUser } from '@/components/providers/SupabaseUserProvider';
import Footer from './Footer';
import Header from './Header';
import LoggedInNav from './LoggedInNav';
import ReviewBanner from './ReviewBanner';
import ReviewModal from './ReviewModal';
import ProfileGuard from './ProfileGuard';

interface PendingReview {
  meeting_id: string;
  booking_id: string;
  other_participant_name: string;
  meeting_title: string;
  [key: string]: unknown;
}

/**
 * Main application layout that wraps the content with Header/LoggedInNav and Footer.
 * Handles the display of the ReviewBanner and ReviewModal for logged-in users.
 */
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PendingReview | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't show header/footer on auth pages
  const isAuthPage = pathname === '/login';

  const handleReviewClick = useCallback((review: PendingReview) => {
    setSelectedReview(review);
    setIsReviewModalOpen(true);
  }, []);

  const handleReviewSubmitted = useCallback((review: unknown) => {
    // The review submission will be handled by the specific page components
    // that use React Query to invalidate their caches
    console.log('Review submitted:', review);
  }, []);

  const handleCloseReviewModal = useCallback(() => {
    setIsReviewModalOpen(false);
    setSelectedReview(null);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-slate-50">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Show appropriate header based on authentication status */}
      {!isAuthPage && (user ? <LoggedInNav /> : <Header transparent={pathname === '/'} />)}

      {/* Main content */}
      <main
        className={`flex-1 w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 ${pathname === '/' ? '' : 'pt-16'}`}
      >
        {/* Show review banner for logged-in users */}
        {mounted && user && !isAuthPage && (
          <div className="container mx-auto px-4 pt-4">
            <ReviewBanner onReviewClick={handleReviewClick} />
          </div>
        )}
        <ProfileGuard>{children}</ProfileGuard>
      </main>

      {/* Show footer on all pages except auth pages */}
      {!isAuthPage && <Footer />}

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        pendingReview={selectedReview}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default AppLayout;
