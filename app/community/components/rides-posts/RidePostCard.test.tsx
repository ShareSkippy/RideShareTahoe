import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RidePostCard } from './RidePostCard';
import { RidePostType, ProfileType } from '@/app/community/types';

// Mock next/link
// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock next/image
jest.mock('next/image', () => {
  const MockImage = ({ src, alt }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

// Mock useHasActiveBooking
jest.mock('@/hooks/useHasActiveBooking', () => ({
  useHasActiveBooking: jest.fn().mockReturnValue({ hasBooking: true, isLoading: false }),
}));

describe('RidePostCard', () => {
  const mockOwner: ProfileType = {
    id: 'owner-123',
    first_name: 'John',
    last_name: 'Doe',
    profile_photo_url: 'https://example.com/photo.jpg',
    neighborhood: 'Downtown',
    city: 'San Francisco',
    state: 'CA',
    bio: 'Hello',
    role: 'user',
    car_details: null,
    community_support_badge: null,
    support_preferences: [],
    support_story: null,
    other_support_description: null,
    facebook_url: null,
    instagram_url: null,
    linkedin_url: null,
    airbnb_url: null,
    other_social_url: null,
  };

  const mockPost: RidePostType = {
    id: 'post-123',
    poster_id: 'owner-123',
    title: 'Trip to Tahoe',
    description: 'Fun trip',
    start_location: 'SF',
    end_location: 'Tahoe',
    start_lat: 37.7749,
    start_lng: -122.4194,
    end_lat: 39.0968,
    end_lng: -120.0324,
    departure_date: '2023-12-25T12:00:00',
    departure_time: '12:00',
    return_date: '2023-12-27T00:00:00',
    return_time: '18:00',
    is_round_trip: true,
    trip_direction: 'departure',
    round_trip_group_id: null,
    is_recurring: false,
    recurring_days: null,
    posting_type: 'driver',
    status: 'active',
    created_at: '2023-12-01',
    pricing_type: 'per_seat',
    price_per_seat: 50,
    gas_estimate: null,
    total_seats: 3,
    available_seats: 3,
    car_type: 'SUV',
    has_awd: true,
    driving_arrangement: 'Meet at Civic Center BART',
    music_preference: 'Indie & folk',
    conversation_preference: 'Friendly chat',
    special_instructions: 'Bring snacks and water',
    owner: mockOwner,
  };

  const mockOnMessage = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ride details correctly', () => {
    render(<RidePostCard post={mockPost} onMessage={mockOnMessage} />);

    expect(screen.getByText('Trip to Tahoe')).toBeInTheDocument();
    expect(screen.getByText('SF')).toBeInTheDocument();
    expect(screen.getByText('Tahoe')).toBeInTheDocument();
    expect(screen.getByText('Dec 25, 2023 · 12:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Return: Dec 27, 2023 · 6:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Vehicle: SUV (AWD)')).toBeInTheDocument();
    expect(screen.getByText('Pickup: Meet at Civic Center BART')).toBeInTheDocument();
    expect(screen.getByText('Music: Indie & folk')).toBeInTheDocument();
    expect(screen.getByText('Conversation: Friendly chat')).toBeInTheDocument();
    expect(screen.getByText('Notes: Bring snacks and water')).toBeInTheDocument();
  });

  it('renders driver badge and price for driver posts', () => {
    render(<RidePostCard post={mockPost} onMessage={mockOnMessage} />);

    expect(screen.getByText('🚗 Driver')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('3 seats left')).toBeInTheDocument();
  });

  it('renders passenger badge for passenger posts', () => {
    const passengerPost = { ...mockPost, posting_type: 'passenger' as const };
    render(<RidePostCard post={passengerPost} onMessage={mockOnMessage} />);

    expect(screen.getByText('👋 Passenger')).toBeInTheDocument();
  });

  it('renders flexible badge for flexible posts', () => {
    const flexiblePost = { ...mockPost, posting_type: 'flexible' as const };
    render(<RidePostCard post={flexiblePost} onMessage={mockOnMessage} />);

    expect(screen.getByText('🤝 Flexible')).toBeInTheDocument();
  });

  it('renders Edit and Hide buttons for owner', () => {
    render(
      <RidePostCard
        post={mockPost}
        currentUserId="owner-123"
        onMessage={mockOnMessage}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Hide')).toBeInTheDocument();
    expect(screen.queryByText('Message')).not.toBeInTheDocument();
  });

  it('calls onDelete when Hide is clicked', () => {
    render(
      <RidePostCard
        post={mockPost}
        currentUserId="owner-123"
        onMessage={mockOnMessage}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Hide'));
    expect(mockOnDelete).toHaveBeenCalledWith('post-123');
  });

  it('renders Message button for non-owner', () => {
    render(<RidePostCard post={mockPost} currentUserId="other-user" onMessage={mockOnMessage} />);

    expect(screen.getByText('Message')).toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Hide')).not.toBeInTheDocument();
  });

  it('calls onMessage when Message is clicked', () => {
    render(<RidePostCard post={mockPost} currentUserId="other-user" onMessage={mockOnMessage} />);

    fireEvent.click(screen.getByText('Message'));
    expect(mockOnMessage).toHaveBeenCalledWith(mockOwner, mockPost);
  });

  it('renders View Profile link', () => {
    render(<RidePostCard post={mockPost} onMessage={mockOnMessage} />);

    const profileLink = screen.getByText('View Profile');
    expect(profileLink).toBeInTheDocument();
    expect(profileLink.closest('a')).toHaveAttribute('href', '/profile/owner-123');
  });
});
