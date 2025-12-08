import { renderHook, act } from '@testing-library/react';
import { useMessageModal } from './useMessageModal';
import type { ProfileType, RidePostType } from '../types';

describe('useMessageModal', () => {
  it('should initialize with modal closed', () => {
    const { result } = renderHook(() => useMessageModal());

    expect(result.current.messageModal).toEqual({
      isOpen: false,
      recipient: null,
      ridePost: null,
    });
  });

  it('should open modal with correct data', () => {
    const { result } = renderHook(() => useMessageModal());
    const mockRecipient = { id: 'user-2', full_name: 'Test User' } as unknown as ProfileType;
    const mockRidePost = { id: 'ride-1', departure_date: '2023-01-01' } as unknown as RidePostType;

    act(() => {
      result.current.openMessageModal(mockRecipient, mockRidePost);
    });

    expect(result.current.messageModal).toEqual({
      isOpen: true,
      recipient: mockRecipient,
      ridePost: mockRidePost,
    });
  });

  it('should close modal and reset data', () => {
    const { result } = renderHook(() => useMessageModal());
    const mockRecipient = { id: 'user-2' } as unknown as ProfileType;
    const mockRidePost = { id: 'ride-1' } as unknown as RidePostType;

    // First open it
    act(() => {
      result.current.openMessageModal(mockRecipient, mockRidePost);
    });

    expect(result.current.messageModal.isOpen).toBe(true);

    // Then close it
    act(() => {
      result.current.closeMessageModal();
    });

    expect(result.current.messageModal).toEqual({
      isOpen: false,
      recipient: null,
      ridePost: null,
    });
  });
});
