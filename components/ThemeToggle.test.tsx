import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from 'next-themes';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('ThemeToggle', () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders light mode icon when theme is dark', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    const button = screen.getByLabelText('Toggle dark mode');
    expect(button).toBeInTheDocument();
    // Check for sun icon path (part of it)
    expect(button.innerHTML).toContain('M12 3v2.25');
  });

  it('renders dark mode icon when theme is light', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    const button = screen.getByLabelText('Toggle dark mode');
    expect(button).toBeInTheDocument();
    // Check for moon icon path (part of it)
    expect(button.innerHTML).toContain('M21.752 15.002');
  });

  it('toggles theme from dark to light', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByLabelText('Toggle dark mode'));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('toggles theme from light to dark', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByLabelText('Toggle dark mode'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
