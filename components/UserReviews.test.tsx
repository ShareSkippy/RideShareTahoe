import { render, screen } from '@testing-library/react';
import UserReviews from './UserReviews';
import { useUserReviews } from '@/hooks/useReviews';

// Mock useReviews
jest.mock('@/hooks/useReviews', () => ({
  useUserReviews: jest.fn(),
}));

describe('UserReviews', () => {
  const mockProfileId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useUserReviews as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<UserReviews profileId={mockProfileId} />);
    // Check for pulse animation
    const pulseElement = document.querySelector('.animate-pulse');
    expect(pulseElement).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useUserReviews as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load reviews'),
    });

    render(<UserReviews profileId={mockProfileId} />);
    expect(screen.getByText('Failed to load reviews')).toBeInTheDocument();
  });

  it('renders no reviews state', () => {
    (useUserReviews as jest.Mock).mockReturnValue({
      data: {
        reviews: [],
        stats: {
          averageRating: 0,
          reviewCount: 0,
          ratingDistribution: {},
        },
      },
      isLoading: false,
      error: null,
    });

    render(<UserReviews profileId={mockProfileId} />);
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
  });

  it('renders reviews and stats correctly', () => {
    const mockData = {
      reviews: [
        {
          id: '1',
          rating: 5,
          created_at: '2023-01-01',
          comment: 'Great driver!',
          booking: {
            ride: {
              start_location: 'San Francisco',
              end_location: 'Tahoe City',
            },
          },
        },
      ],
      stats: {
        averageRating: 5,
        reviewCount: 1,
        ratingDistribution: { 5: 1 },
      },
    };

    (useUserReviews as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });

    render(<UserReviews profileId={mockProfileId} />);

    expect(screen.getByText('5.0')).toBeInTheDocument();
    expect(screen.getByText('Based on 1 review')).toBeInTheDocument();
    expect(screen.getByText('Great driver!')).toBeInTheDocument();
    expect(screen.getByText('Ride: San Francisco → Tahoe City')).toBeInTheDocument();
  });

  it('renders rating distribution correctly', () => {
    const mockData = {
      reviews: [],
      stats: {
        averageRating: 4.5,
        reviewCount: 2,
        ratingDistribution: { 5: 1, 4: 1 },
      },
    };

    (useUserReviews as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });

    render(<UserReviews profileId={mockProfileId} />);

    // Check if distribution bars are rendered (checking for counts)
    const counts = screen.getAllByText('1');
    expect(counts.length).toBeGreaterThanOrEqual(2); // One for 5 stars, one for 4 stars
  });
});
