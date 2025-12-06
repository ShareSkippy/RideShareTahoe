import { render, screen, fireEvent } from '@testing-library/react';
import ButtonSupport from './ButtonSupport';
import { Crisp } from 'crisp-sdk-web';
import config from '@/config';

// Mock dependencies
jest.mock('crisp-sdk-web', () => ({
  Crisp: {
    chat: {
      show: jest.fn(),
      open: jest.fn(),
    },
  },
}));

jest.mock('@/config', () => ({
  appName: 'RideShareTahoe',
  crisp: {
    id: 'mock-crisp-id',
  },
  resend: {
    supportEmail: 'support@example.com',
  },
}));

describe('ButtonSupport', () => {
  const mockOpen = jest.fn();
  const originalOpen = globalThis.open;

  beforeAll(() => {
    globalThis.open = mockOpen;
  });

  afterAll(() => {
    globalThis.open = originalOpen;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ButtonSupport />);
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByTitle('Chat with support')).toBeInTheDocument();
  });

  it('opens Crisp chat when configured', () => {
    // Ensure crisp ID is set in mock
    (config as { crisp?: { id: string } }).crisp = { id: 'mock-crisp-id' };

    render(<ButtonSupport />);
    fireEvent.click(screen.getByText('Support'));

    expect(Crisp.chat.show).toHaveBeenCalled();
    expect(Crisp.chat.open).toHaveBeenCalled();
    expect(mockOpen).not.toHaveBeenCalled();
  });

  it('opens email client when Crisp is not configured', () => {
    // Remove crisp ID from mock
    (config as { crisp?: { id: string } }).crisp = undefined;

    render(<ButtonSupport />);
    fireEvent.click(screen.getByText('Support'));

    expect(Crisp.chat.show).not.toHaveBeenCalled();
    expect(Crisp.chat.open).not.toHaveBeenCalled();
    expect(mockOpen).toHaveBeenCalledWith(
      'mailto:support@example.com?subject=Need help with RideShareTahoe',
      '_blank'
    );
  });
});
