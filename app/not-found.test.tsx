import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'Link';
  return MockLink;
});

describe('NotFound', () => {
  it('renders 404 heading and message', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText(/Looks like you've ventured off-trail/)).toBeInTheDocument();
  });

  it('renders Return Home link pointing to /', () => {
    render(<NotFound />);

    const link = screen.getByText('Return Home');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });
});
