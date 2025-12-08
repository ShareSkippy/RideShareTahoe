import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LocationFilters } from './LocationFilters';
import { geocodeLocation } from '@/libs/geocoding';

// Mock geocoding
jest.mock('@/libs/geocoding', () => ({
  geocodeLocation: jest.fn(),
}));

describe('LocationFilters', () => {
  const mockOnDepartureFilterChange = jest.fn();
  const mockOnDestinationFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render inputs', () => {
    render(
      <LocationFilters
        onDepartureFilterChange={mockOnDepartureFilterChange}
        onDestinationFilterChange={mockOnDestinationFilterChange}
      />
    );

    // Using query selectors that match the actual component
    expect(screen.getByLabelText(/departure location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination location/i)).toBeInTheDocument();
  });

  it('should handle departure search success', async () => {
    (geocodeLocation as jest.Mock).mockResolvedValue({ lat: 10, lng: 20 });

    render(
      <LocationFilters
        onDepartureFilterChange={mockOnDepartureFilterChange}
        onDestinationFilterChange={mockOnDestinationFilterChange}
      />
    );

    const input = screen.getByLabelText(/departure location/i);
    fireEvent.change(input, { target: { value: 'Tahoe' } });

    // Find button by role and name
    const submitBtn = screen.getByRole('button', { name: /search departure/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/searching/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockOnDepartureFilterChange).toHaveBeenCalledWith({
        lat: 10,
        lng: 20,
        radius: 25, // default
      });
    });

    expect(screen.queryByText(/searching/i)).not.toBeInTheDocument();
  });

  it('should handle departure search error (not found)', async () => {
    (geocodeLocation as jest.Mock).mockResolvedValue(null);

    render(
      <LocationFilters
        onDepartureFilterChange={mockOnDepartureFilterChange}
        onDestinationFilterChange={mockOnDestinationFilterChange}
      />
    );

    const input = screen.getByLabelText(/departure location/i);
    fireEvent.change(input, { target: { value: 'Nowhere' } });

    // Find button by role and name
    const submitBtn = screen.getByRole('button', { name: /search departure/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Location not found. Please try again.')).toBeInTheDocument();
    });

    expect(mockOnDepartureFilterChange).not.toHaveBeenCalled();
  });

  it('should clear departure filter', async () => {
    (geocodeLocation as jest.Mock).mockResolvedValue({ lat: 10, lng: 20 });

    render(
      <LocationFilters
        onDepartureFilterChange={mockOnDepartureFilterChange}
        onDestinationFilterChange={mockOnDestinationFilterChange}
      />
    );

    // Search first to set filter
    const input = screen.getByLabelText(/departure location/i);
    fireEvent.change(input, { target: { value: 'Tahoe' } });
    fireEvent.click(screen.getByRole('button', { name: /search departure/i }));

    await waitFor(() => {
      expect(screen.getByText(/within 25 miles of tahoe/i)).toBeInTheDocument();
    });

    // Validates that clear button appears
    // The clear button has text "Clear"
    const clearBtn = screen.getByRole('button', { name: /clear/i });

    fireEvent.click(clearBtn);

    expect(input).toHaveValue('');
    expect(mockOnDepartureFilterChange).toHaveBeenCalledWith(null);
  });
});
