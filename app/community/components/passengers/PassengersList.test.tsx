import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PassengersList from './PassengersList';
import { fetchProfiles } from '@/libs/community/profilesData';
import type { ProfileType } from '../../types';
import type { CommunitySupabaseClient } from '@/libs/community/ridesData';

// Mocks
jest.mock('@/libs/community/profilesData', () => ({
  fetchProfiles: jest.fn(),
}));

jest.mock('./PassengerCard', () => ({
  __esModule: true,
  default: ({ profile }: { profile: ProfileType }) => (
    <div data-testid="passenger-card">{profile.first_name}</div>
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

describe('PassengersList', () => {
  const mockSupabase = {} as unknown as CommunitySupabaseClient;

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  const mockSuccess = (profiles: ProfileType[], totalCount = 10) => {
    (fetchProfiles as jest.Mock).mockResolvedValue({
      profiles,
      totalCount,
    });
  };

  it('renders and fetches profiles', async () => {
    mockSuccess([{ id: 'p1', first_name: 'Alice' } as ProfileType], 1);
    render(<PassengersList supabase={mockSupabase} />);

    await waitFor(() => {
      expect(screen.getByTestId('passenger-card')).toHaveTextContent('Alice');
    });

    expect(screen.getByText('1 passenger found')).toBeInTheDocument();
  });

  it('pagination interactions', async () => {
    mockSuccess([{ id: 'p1', first_name: 'Alice' } as ProfileType], 20); // 2 pages
    render(<PassengersList supabase={mockSupabase} />);

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('next-page'));

    await waitFor(() => {
      expect(screen.getByText('Page 2')).toBeInTheDocument();
    });

    expect(globalThis.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('handles empty state', async () => {
    mockSuccess([], 0);
    render(<PassengersList supabase={mockSupabase} />);

    await waitFor(() => {
      expect(screen.getByText('No Passengers Found')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    (fetchProfiles as jest.Mock).mockRejectedValue(new Error('Fail'));
    render(<PassengersList supabase={mockSupabase} />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load passengers/)).toBeInTheDocument();
    });
  });
});
