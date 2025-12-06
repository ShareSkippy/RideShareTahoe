import { useCallback, useState } from 'react';
import type { MessageModalState, ProfileType, RidePostType } from '../types';

export const useMessageModal = () => {
  const [messageModal, setMessageModal] = useState<MessageModalState>({
    isOpen: false,
    recipient: null,
    ridePost: null,
  });

  const openMessageModal = useCallback((recipient: ProfileType, ridePost: RidePostType | null) => {
    setMessageModal({ isOpen: true, recipient, ridePost });
  }, []);

  const closeMessageModal = useCallback(() => {
    setMessageModal({ isOpen: false, recipient: null, ridePost: null });
  }, []);

  return {
    messageModal,
    openMessageModal,
    closeMessageModal,
  };
};
