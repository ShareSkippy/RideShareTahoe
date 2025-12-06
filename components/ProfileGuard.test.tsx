import { render, screen, waitFor } from '@testing-library/react';
import ProfileGuard from './ProfileGuard';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/components/providers/SupabaseUserProvider';
import { useUserProfile } from '@/hooks/useProfile';

// Mock dependencies
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/components/providers/SupabaseUserProvider', () => ({
  useUser: jest.fn(),
}));

jest.mock('@/hooks/useProfile', () => ({
  useUserProfile: jest.fn(),
}));

describe('ProfileGuard', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders children', () => {
    (useUser as jest.Mock).mockReturnValue({ user: null, loading: false });
    (useUserProfile as jest.Mock).mockReturnValue({ data: null, isLoading: false });
    (usePathname as jest.Mock).mockReturnValue('/');

    render(
      <ProfileGuard>
        <div>Child Content</div>
      </ProfileGuard>
    );

    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('does nothing if loading', () => {
    (useUser as jest.Mock).mockReturnValue({ user: { id: '1' }, loading: true });
    (useUserProfile as jest.Mock).mockReturnValue({ data: null, isLoading: false });
    (usePathname as jest.Mock).mockReturnValue('/dashboard');

    render(
      <ProfileGuard>
        <div>Child Content</div>
      </ProfileGuard>
    );

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does nothing if user is not logged in', () => {
    (useUser as jest.Mock).mockReturnValue({ user: null, loading: false });
    (useUserProfile as jest.Mock).mockReturnValue({ data: null, isLoading: false });
    (usePathname as jest.Mock).mockReturnValue('/dashboard');

    render(
      <ProfileGuard>
        <div>Child Content</div>
      </ProfileGuard>
    );

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does nothing if on public path', () => {
    (useUser as jest.Mock).mockReturnValue({ user: { id: '1' }, loading: false });
    (useUserProfile as jest.Mock).mockReturnValue({ data: null, isLoading: false });
    (usePathname as jest.Mock).mockReturnValue('/login');

    render(
      <ProfileGuard>
        <div>Child Content</div>
      </ProfileGuard>
    );

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does nothing if on setup path', () => {
    (useUser as jest.Mock).mockReturnValue({ user: { id: '1' }, loading: false });
    (useUserProfile as jest.Mock).mockReturnValue({ data: null, isLoading: false });
    (usePathname as jest.Mock).mockReturnValue('/complete-profile');

    render(
      <ProfileGuard>
        <div>Child Content</div>
      </ProfileGuard>
    );

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirects to /complete-profile if logged in, not on public/setup path, and profile is missing', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: { id: '1' }, loading: false });
    (useUserProfile as jest.Mock).mockReturnValue({ data: null, isLoading: false });
    (usePathname as jest.Mock).mockReturnValue('/dashboard');

    render(
      <ProfileGuard>
        <div>Child Content</div>
      </ProfileGuard>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/complete-profile');
    });
  });

  it('redirects to /complete-profile if logged in, not on public/setup path, and profile is incomplete', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: { id: '1' }, loading: false });
    (useUserProfile as jest.Mock).mockReturnValue({ data: { first_name: '' }, isLoading: false });
    (usePathname as jest.Mock).mockReturnValue('/dashboard');

    render(
      <ProfileGuard>
        <div>Child Content</div>
      </ProfileGuard>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/complete-profile');
    });
  });

  it('does not redirect if profile is complete', () => {
    (useUser as jest.Mock).mockReturnValue({ user: { id: '1' }, loading: false });
    (useUserProfile as jest.Mock).mockReturnValue({
      data: { first_name: 'John' },
      isLoading: false,
    });
    (usePathname as jest.Mock).mockReturnValue('/dashboard');

    render(
      <ProfileGuard>
        <div>Child Content</div>
      </ProfileGuard>
    );

    expect(mockPush).not.toHaveBeenCalled();
  });
});
