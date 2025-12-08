import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { PassengersSection } from './PassengersSection';
import { fetchPassengerRides } from '@/libs/community/ridesData';
import type { RidePostType, LocationFilterType, ProfileType } from '../../types';
import type { CommunitySupabaseClient } from '@/libs/community/ridesData';

// Mocks
jest.mock('@/libs/community/ridesData', () => ({
  fetchPassengerRides: jest.fn(),
}));

jest.mock('../passengers-posts/PassengerPostCard', () => ({
  PassengerPostCard: ({
    post,
    onMessage,
  }: {
    post: RidePostType;
    // eslint-disable-next-line no-unused-vars
    onMessage: (_recipient: ProfileType, _post: RidePostType) => void;
  }) => (
    <div data-testid="passenger-card">
      {post.id}
      <button onClick={() => onMessage({ id: 'owner' } as ProfileType, post)}>Message</button>
    </div>
  ),
}));

jest.mock('../PaginationControls', () => ({
  PaginationControls: ({
    onPageChange,
    currentPage,
  }: {
    // eslint-disable-next-line no-unused-vars
    onPageChange: (_page: number) => void;
    currentPage: number;
  }) => (
    <div data-testid="pagination">
      Page {currentPage}
      <button onClick={() => onPageChange(currentPage + 1)} data-testid="next-page">
        Next
      </button>
    </div>
  ),
}));

jest.mock('../LocationFilters', () => ({
  LocationFilters: ({
    onDepartureFilterChange,
  }: {
    // eslint-disable-next-line no-unused-vars
    onDepartureFilterChange: (_filter: LocationFilterType) => void;
  }) => (
    <button
      onClick={() => onDepartureFilterChange({ lat: 1, lng: 1, radius: 25 })}
      data-testid="filter-btn"
    >
      Filter
    </button>
  ),
}));

describe('PassengersSection', () => {
  const mockSupabase = {} as unknown as CommunitySupabaseClient;
  const mockUser = { id: 'u1' };
  const mockOpenMessageModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  const mockSuccess = (rides: RidePostType[], totalCount = 10) => {
    (fetchPassengerRides as jest.Mock).mockResolvedValue({
      rides,
      totalCount,
      hasMore: totalCount > rides.length,
    });
  };

  it('should render loading state', async () => {
    (fetchPassengerRides as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(
      <PassengersSection
        user={mockUser}
        supabase={mockSupabase}
        openMessageModal={mockOpenMessageModal}
      />
    );
    // If loading component is rendered, we would check for it.
    // For now just ensuring no crash.
  });

  it('scrolls and calls fetch on pagination', async () => {
    mockSuccess([{ id: 'r1' }] as unknown as RidePostType[], 20);
    render(
      <PassengersSection
        user={mockUser}
        supabase={mockSupabase}
        openMessageModal={mockOpenMessageModal}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('next-page'));

    await waitFor(() => {
      expect(screen.getByText('Page 2')).toBeInTheDocument();
    });

    expect(globalThis.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('fetches with filter', async () => {
    mockSuccess([{ id: 'r1' }] as unknown as RidePostType[], 1);
    render(
      <PassengersSection
        user={mockUser}
        supabase={mockSupabase}
        openMessageModal={mockOpenMessageModal}
      />
    );

    await waitFor(() => expect(screen.getByTestId('passenger-card')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('filter-btn'));

    await waitFor(() => {
      expect(fetchPassengerRides).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({
          departureFilter: expect.objectContaining({ lat: 1 }),
        })
      );
    });
  });

  it('handles empty state', async () => {
    mockSuccess([], 0);
    render(
      <PassengersSection
        user={mockUser}
        supabase={mockSupabase}
        openMessageModal={mockOpenMessageModal}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('No passengers looking right now')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    (fetchPassengerRides as jest.Mock).mockRejectedValue(new Error('Fail'));
    render(
      <PassengersSection
        user={mockUser}
        supabase={mockSupabase}
        openMessageModal={mockOpenMessageModal}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Passengers Looking for Rides')).toBeInTheDocument();
      expect(screen.getByText(/Failed to load passenger requests/)).toBeInTheDocument();
    });
  });
});
