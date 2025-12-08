import { render, screen } from '@testing-library/react';
import { DriverCard } from './DriverCard';

import type { ProfileType } from '../../types';

describe('DriverCard', () => {
  const mockDriver = {
    id: 'd1',
    first_name: 'John',
    last_name: 'Doe',
    city: 'San Francisco',
    state: 'CA',
    profile_photo_url: 'http://example.com/photo.jpg',
    car_details: { type: 'Toyota Prius', color: 'White', year: 2020 },
    bio: 'Experienced driver.',
    linkedin_url: 'http://linkedin.com/johndoe',
  } as unknown as ProfileType;

  it('renders driver name and location', () => {
    render(<DriverCard driver={mockDriver} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/San Francisco, CA/)).toBeInTheDocument();
  });

  it('renders avatar', () => {
    render(<DriverCard driver={mockDriver} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', expect.stringContaining('photo.jpg'));
  });

  it('renders car details', () => {
    render(<DriverCard driver={mockDriver} />);
    expect(screen.getByText(/Toyota Prius/)).toBeInTheDocument();
    expect(screen.getByText(/White • 2020/)).toBeInTheDocument();
  });

  it('renders bio', () => {
    render(<DriverCard driver={mockDriver} />);
    expect(screen.getByText('Experienced driver.')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<DriverCard driver={mockDriver} />);
    expect(screen.getByLabelText('LinkedIn')).toHaveAttribute(
      'href',
      'http://linkedin.com/johndoe'
    );
  });

  it('handles missing info (fallbacks)', () => {
    const minimalDriver = {
      id: 'd2',
      first_name: 'Jane',
    } as unknown as ProfileType;
    render(<DriverCard driver={minimalDriver} />);

    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Location not specified')).toBeInTheDocument();
    expect(screen.getByText('No vehicle details')).toBeInTheDocument();
    expect(screen.getByText('No bio provided.')).toBeInTheDocument();
  });
});
