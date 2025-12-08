import { render, screen, fireEvent } from '@testing-library/react';
import { PaginationControls } from './PaginationControls';

describe('PaginationControls', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if totalPages <= 1', () => {
    const { container } = render(
      <PaginationControls
        currentPage={1}
        totalPages={1}
        hasMore={false}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should render controls', () => {
    render(
      <PaginationControls
        currentPage={2}
        totalPages={5}
        hasMore={true}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('should disable Previous button on first page', () => {
    render(
      <PaginationControls
        currentPage={1}
        totalPages={5}
        hasMore={true}
        onPageChange={mockOnPageChange}
      />
    );

    const prevBtn = screen.getByRole('button', { name: /previous/i });
    expect(prevBtn).toBeDisabled();

    fireEvent.click(prevBtn);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('should call onPageChange with prev page when Previous clicked', () => {
    render(
      <PaginationControls
        currentPage={3}
        totalPages={5}
        hasMore={true}
        onPageChange={mockOnPageChange}
      />
    );

    const prevBtn = screen.getByRole('button', { name: /previous/i });
    expect(prevBtn).not.toBeDisabled();

    fireEvent.click(prevBtn);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should disable Next button if no more pages', () => {
    render(
      <PaginationControls
        currentPage={5}
        totalPages={5}
        hasMore={false}
        onPageChange={mockOnPageChange}
      />
    );

    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).toBeDisabled();

    fireEvent.click(nextBtn);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('should call onPageChange with next page when Next clicked', () => {
    render(
      <PaginationControls
        currentPage={1}
        totalPages={5}
        hasMore={true}
        onPageChange={mockOnPageChange}
      />
    );

    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).not.toBeDisabled();

    fireEvent.click(nextBtn);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });
});
