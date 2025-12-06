import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LocationFilter from './LocationFilter';
import { geocodeLocation } from '@/libs/geocoding';

// Mock geocodeLocation
jest.mock('@/libs/geocoding', () => ({
  geocodeLocation: jest.fn(),
}));

describe('LocationFilter', () => {
  const mockOnFilterChange = jest.fn();
  const mockGeolocation = {
    getCurrentPosition: jest.fn(),
  };

  beforeAll(() => {
    (globalThis.navigator as unknown as { geolocation: typeof mockGeolocation }).geolocation =
      mockGeolocation;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<LocationFilter onFilterChange={mockOnFilterChange} />);
    expect(screen.getByText('Filter by Location')).toBeInTheDocument();
    expect(screen.getByText('Share Location')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter zip code or city/i)).toBeInTheDocument();
  });

  it('handles share location success', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) =>
      success({
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      })
    );

    render(<LocationFilter onFilterChange={mockOnFilterChange} />);
    fireEvent.click(screen.getByText('Share Location'));

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        type: 'shared-location',
        lat: 37.7749,
        lng: -122.4194,
        radius: 10,
      });
      expect(screen.getByText(/Within 10 miles of your location/i)).toBeInTheDocument();
    });
  });

  it('handles share location error', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((_, error) =>
      error({
        code: 1, // PERMISSION_DENIED
        message: 'User denied Geolocation',
      })
    );

    render(<LocationFilter onFilterChange={mockOnFilterChange} />);
    fireEvent.click(screen.getByText('Share Location'));

    await waitFor(() => {
      expect(
        screen.getByText(/Location permission denied. Please allow location access/i)
      ).toBeInTheDocument();
    });
  });

  it('handles zip/city search success', async () => {
    (geocodeLocation as jest.Mock).mockResolvedValue({
      lat: 30.2672,
      lng: -97.7431,
    });

    render(<LocationFilter onFilterChange={mockOnFilterChange} />);
    const input = screen.getByPlaceholderText(/Enter zip code or city/i);
    fireEvent.change(input, { target: { value: 'Austin, TX' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        type: 'zip-city',
        lat: 30.2672,
        lng: -97.7431,
        radius: 5,
        query: 'Austin, TX',
      });
      expect(screen.getByText(/Within 5 miles of Austin, TX/i)).toBeInTheDocument();
    });
  });

  it('handles zip/city search error (not found)', async () => {
    (geocodeLocation as jest.Mock).mockResolvedValue(null);

    render(<LocationFilter onFilterChange={mockOnFilterChange} />);
    const input = screen.getByPlaceholderText(/Enter zip code or city/i);
    fireEvent.change(input, { target: { value: 'Invalid Location' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(
        screen.getByText(/Location not found. Please check your zip code/i)
      ).toBeInTheDocument();
    });
  });

  it('handles zip/city search error (exception)', async () => {
    (geocodeLocation as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<LocationFilter onFilterChange={mockOnFilterChange} />);
    const input = screen.getByPlaceholderText(/Enter zip code or city/i);
    fireEvent.change(input, { target: { value: 'Austin, TX' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText(/Failed to geocode location/i)).toBeInTheDocument();
    });
  });

  it('handles clear filter', async () => {
    // Set up active filter first
    mockGeolocation.getCurrentPosition.mockImplementation((success) =>
      success({
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      })
    );

    render(<LocationFilter onFilterChange={mockOnFilterChange} />);
    fireEvent.click(screen.getByText('Share Location'));

    await waitFor(() => {
      expect(screen.getByText('Clear Filter')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Clear Filter'));

    expect(mockOnFilterChange).toHaveBeenCalledWith(null);
    expect(screen.getByText('Share Location')).toBeInTheDocument();
    expect(screen.queryByText('Clear Filter')).not.toBeInTheDocument();
  });
});
