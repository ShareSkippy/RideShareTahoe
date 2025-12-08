import { render, screen, fireEvent } from '@testing-library/react';
import { MyPostsTab } from './MyPostsTab';
import type { RidePostType } from '../types';

// Mock dependency
jest.mock('@/app/community/components/rides-posts/RidePostCard', () => ({
  RidePostCard: ({
    post,
    onDelete,
    deleting,
  }: {
    post: RidePostType;
    // eslint-disable-next-line no-unused-vars
    onDelete: (_id: string) => void;
    deleting: boolean;
  }) => (
    <div data-testid="ride-card">
      {post.id}
      <button onClick={() => onDelete(post.id)} data-testid={`delete-${post.id}`}>
        Delete
      </button>
      {deleting && <span>Deleting...</span>}
    </div>
  ),
}));

describe('MyPostsTab', () => {
  const mockUser = { id: 'user-1' };
  const mockOpenMessageModal = jest.fn();
  const mockDeletePost = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when no rides', () => {
    render(
      <MyPostsTab
        myRides={[]}
        user={mockUser}
        openMessageModal={mockOpenMessageModal}
        deletePost={mockDeletePost}
        deletingPost={null}
      />
    );

    expect(screen.getByText(/You haven't posted any rides yet/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Create New Post/ })).toHaveAttribute(
      'href',
      '/rides/post'
    );
  });

  it('should render list of rides and summary', () => {
    const rides = [
      { id: '1', created_at: '2023-01-01' },
      { id: '2', created_at: '2023-01-02' },
    ] as unknown as RidePostType[];

    render(
      <MyPostsTab
        myRides={rides}
        user={mockUser}
        openMessageModal={mockOpenMessageModal}
        deletePost={mockDeletePost}
        deletingPost={null}
      />
    );

    expect(screen.getByText('2 posts')).toBeInTheDocument();
    expect(screen.getAllByTestId('ride-card')).toHaveLength(2);
  });

  it('should group round trips', () => {
    const rides = [
      { id: '1', created_at: '2023-01-01', round_trip_group_id: 'g1', trip_direction: 'departure' },
      { id: '2', created_at: '2023-01-01', round_trip_group_id: 'g1', trip_direction: 'return' },
      { id: '3', created_at: '2023-01-02' },
    ] as unknown as RidePostType[];

    render(
      <MyPostsTab
        myRides={rides}
        user={mockUser}
        openMessageModal={mockOpenMessageModal}
        deletePost={mockDeletePost}
        deletingPost={null}
      />
    );

    // Should be 2 cards: one group + ride 3
    expect(screen.getByText('2 posts')).toBeInTheDocument();
    expect(screen.getAllByTestId('ride-card')).toHaveLength(2);
  });

  it('should handle delete interaction', () => {
    const rides = [{ id: '1', created_at: '2023-01-01' }] as unknown as RidePostType[];

    render(
      <MyPostsTab
        myRides={rides}
        user={mockUser}
        openMessageModal={mockOpenMessageModal}
        deletePost={mockDeletePost}
        deletingPost={null}
      />
    );

    fireEvent.click(screen.getByTestId('delete-1'));
    expect(mockDeletePost).toHaveBeenCalledWith('1');
  });

  it('should show deleting state', () => {
    const rides = [{ id: '1', created_at: '2023-01-01' }] as unknown as RidePostType[];

    render(
      <MyPostsTab
        myRides={rides}
        user={mockUser}
        openMessageModal={mockOpenMessageModal}
        deletePost={mockDeletePost}
        deletingPost="1"
      />
    );

    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });
});
