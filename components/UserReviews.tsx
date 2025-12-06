'use client';

// #region Imports

import React, { type ReactElement } from 'react';
import { useUserReviews } from '@/hooks/useReviews';

// #endregion

// #region Type Definitions

/**
 * @description Defines the props accepted by the UserReviews component.
 */
interface UserReviewsProps {
  /**
   * @description The ID of the profile to fetch reviews for.
   */
  profileId: string;
  /**
   * @description Flag to determine whether to show all reviews or a summary.
   * @default false
   */
  showAll?: boolean;
}

// #endregion

// #region Helper Functions

/**
 * @description Renders a 5-star rating display.
 * @param {number} rating - The rating number (1-5).
 * @returns {ReactElement} The JSX for the stars.
 */
const renderStars = (rating: number): ReactElement => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star: number) => (
        <span
          key={star}
          className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

/**
 * @description Formats a date string into a short, readable format.
 * @param {string} dateString - The ISO date string.
 * @returns {string} The formatted date.
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// #endregion

// #region Component

/**
 * @description Renders the reviews and rating summary for a user.
 * @param {UserReviewsProps} props - Component props.
 * @returns {ReactElement} The rendered component.
 */
const UserReviews = React.memo(({ profileId, showAll = false }: UserReviewsProps): ReactElement => {
  // #region Data Fetching

  const { data, isLoading, error } = useUserReviews(profileId, showAll);

  // #endregion

  // #region Render Logic: Loading

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i: number) => (
            <div key={i} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // #endregion

  // #region Render Logic: Error

  if (error) {
    const normalizedErrorMessage = (() => {
      const runtimeError = error as unknown;

      if (typeof runtimeError === 'string') {
        return runtimeError;
      }

      if (runtimeError instanceof Error && runtimeError.message) {
        return runtimeError.message;
      }

      return 'Failed to load reviews';
    })();

    return <div className="text-red-600 text-sm">{normalizedErrorMessage}</div>;
  }

  // #endregion

  // #region Data Preparation

  const reviews = data?.reviews || [];
  const stats = data?.stats || {
    averageRating: 0,
    reviewCount: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  // #endregion

  // #region Render Logic: No Reviews

  if (reviews.length === 0 && stats.reviewCount === 0) {
    return <div className="text-gray-500 text-sm">No reviews yet</div>;
  }

  // #endregion

  // #region Render Logic: Main

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.averageRating.toFixed(1)}
          </span>
          {renderStars(Math.round(stats.averageRating))}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Based on {stats.reviewCount} review
          {stats.reviewCount === 1 ? '' : 's'}
        </div>
      </div>

      {/* Rating Distribution */}
      {stats.ratingDistribution && (
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5] || 0;
            const percentage = stats.reviewCount > 0 ? (count / stats.reviewCount) * 100 : 0;

            return (
              <div key={rating} className="flex items-center space-x-2 text-sm">
                <span className="w-4 text-gray-600 dark:text-gray-400">{rating}</span>
                <span className="text-yellow-400">★</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-gray-600 dark:text-gray-400 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Individual Reviews */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {showAll ? 'All Reviews' : 'Recent Reviews'}
          </h4>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(review.created_at)}
                  </span>
                </div>
              </div>
              <p className="text-gray-800 dark:text-gray-200 mb-2">{review.comment}</p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {/* Use optional chaining in case booking is null */}
                Ride: {review.booking?.ride.start_location} → {review.booking?.ride.end_location}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // #endregion
});

UserReviews.displayName = 'UserReviews';

export default UserReviews;

// #endregion
