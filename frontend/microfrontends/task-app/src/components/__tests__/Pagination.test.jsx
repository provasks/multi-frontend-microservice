import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../Pagination';

describe('Pagination Component', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    pageSize: 10,
    hasNext: true,
    hasPrev: false,
    onPageChange: jest.fn(),
    onPageSizeChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pagination with correct information', () => {
    render(<Pagination {...defaultProps} />);
    
    expect(screen.getByText('Showing 1-10 of 50 items')).toBeInTheDocument();
    expect(screen.getByText('Items per page:')).toBeInTheDocument();
  });

  it('renders page numbers correctly for small total pages', () => {
    render(<Pagination {...defaultProps} />);
    
    // Check page numbers in pagination (not in select options)
    expect(screen.getByRole('button', { name: /go to page 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 2/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 3/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 4/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 5/i })).toBeInTheDocument();
  });

  it('renders page numbers with ellipsis for large total pages', () => {
    render(<Pagination {...defaultProps} totalPages={20} currentPage={10} />);
    
    // Use getAllByRole to handle multiple elements with same aria-label
    const page1Buttons = screen.getAllByRole('button', { name: /go to page 1/i });
    expect(page1Buttons.length).toBeGreaterThan(0);
    expect(screen.getAllByText('...')).toHaveLength(2); // Two ellipsis elements
    expect(screen.getByRole('button', { name: /go to page 8/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 9/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 10/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 11/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 12/i })).toBeInTheDocument();
    const page20Buttons = screen.getAllByRole('button', { name: /go to page 20/i });
    expect(page20Buttons.length).toBeGreaterThan(0);
  });

  it('highlights current page correctly', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const currentPageButton = screen.getByText('3');
    expect(currentPageButton.closest('li')).toHaveClass('active');
  });

  it('disables previous button when on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} hasPrev={false} />);
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button when on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} hasNext={false} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('enables previous button when not on first page', () => {
    render(<Pagination {...defaultProps} currentPage={2} hasPrev={true} />);
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).not.toBeDisabled();
  });

  it('enables next button when not on last page', () => {
    render(<Pagination {...defaultProps} currentPage={1} hasNext={true} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onPageChange when page number is clicked', async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} />);
    
    const pageButton = screen.getByText('2');
    await user.click(pageButton);
    
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when previous button is clicked', async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} currentPage={2} hasPrev={true} />);
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    await user.click(prevButton);
    
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when next button is clicked', async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);
    
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageSizeChange when page size is changed', async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} />);
    
    const pageSizeSelect = screen.getByDisplayValue('10');
    await user.selectOptions(pageSizeSelect, '20');
    
    expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('renders correct page size options', () => {
    render(<Pagination {...defaultProps} />);
    
    const pageSizeSelect = screen.getByDisplayValue('10');
    expect(pageSizeSelect).toBeInTheDocument();
    
    // Check that all options are present in the select
    expect(screen.getByRole('option', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '10' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '20' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '50' })).toBeInTheDocument();
  });

  it('handles single page correctly', () => {
    render(<Pagination {...defaultProps} totalPages={1} currentPage={1} hasNext={false} hasPrev={false} />);
    
    expect(screen.getByText('Showing 50 of 50 items')).toBeInTheDocument();
    // For single page, only the info is shown, no pagination controls
  });

  it('handles zero total pages gracefully', () => {
    render(<Pagination {...defaultProps} totalPages={0} totalItems={0} />);
    
    expect(screen.getByText('Showing 0 of 0 items')).toBeInTheDocument();
  });

  it('handles large page numbers correctly', () => {
    render(<Pagination {...defaultProps} totalPages={1000} currentPage={500} totalItems={50000} pageSize={50} />);
    
    expect(screen.getByText('Showing 24951-25000 of 50000 items')).toBeInTheDocument();
    const page1Buttons = screen.getAllByRole('button', { name: /go to page 1/i });
    expect(page1Buttons.length).toBeGreaterThan(0);
    expect(screen.getAllByText('...')).toHaveLength(2); // Two ellipsis elements
    expect(screen.getByRole('button', { name: /go to page 498/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 499/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 500/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 501/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 502/i })).toBeInTheDocument();
    const page1000Buttons = screen.getAllByRole('button', { name: /go to page 1000/i });
    expect(page1000Buttons.length).toBeGreaterThan(0);
  });

  it('handles edge case when current page is near start', () => {
    render(<Pagination {...defaultProps} totalPages={20} currentPage={2} />);
    
    const page1Buttons = screen.getAllByRole('button', { name: /go to page 1/i });
    expect(page1Buttons.length).toBeGreaterThan(0);
    const page2Buttons = screen.getAllByRole('button', { name: /go to page 2/i });
    expect(page2Buttons.length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /go to page 3/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 4/i })).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    const page20Buttons = screen.getAllByRole('button', { name: /go to page 20/i });
    expect(page20Buttons.length).toBeGreaterThan(0);
  });

  it('handles edge case when current page is near end', () => {
    render(<Pagination {...defaultProps} totalPages={20} currentPage={19} />);
    
    const page1Buttons = screen.getAllByRole('button', { name: /go to page 1/i });
    expect(page1Buttons.length).toBeGreaterThan(0);
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 17/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 18/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 19/i })).toBeInTheDocument();
    const page20Buttons = screen.getAllByRole('button', { name: /go to page 20/i });
    expect(page20Buttons.length).toBeGreaterThan(0);
  });

  it('renders with correct CSS classes', () => {
    const { container } = render(<Pagination {...defaultProps} />);
    
    expect(container.firstChild).toHaveClass('pagination-container');
    expect(screen.getByText('Showing 1-10 of 50 items')).toBeInTheDocument();
  });

  it('handles missing props gracefully', () => {
    render(<Pagination />);
    
    expect(screen.getByText(/Showing NaN-NaN of\s+items/)).toBeInTheDocument();
  });

  it('handles negative values gracefully', () => {
    render(<Pagination {...defaultProps} currentPage={-1} totalPages={-5} totalItems={-10} />);
    
    expect(screen.getByText('Showing -10 of -10 items')).toBeInTheDocument();
  });

  it('handles very large numbers', () => {
    render(<Pagination {...defaultProps} totalPages={999999} currentPage={500000} totalItems={9999999} />);
    
    expect(screen.getByText('Showing 4999991-5000000 of 9999999 items')).toBeInTheDocument();
  });

  it('handles decimal values', () => {
    render(<Pagination {...defaultProps} currentPage={1.5} totalPages={5.7} totalItems={50.3} />);
    
    expect(screen.getByText('Showing 6-15 of 50.3 items')).toBeInTheDocument();
  });

  it('renders page size selector with correct value', () => {
    render(<Pagination {...defaultProps} pageSize={20} />);
    
    const pageSizeSelect = screen.getByDisplayValue('20');
    expect(pageSizeSelect).toBeInTheDocument();
  });

  it('handles page size change to different values', async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} />);
    
    const pageSizeSelect = screen.getByDisplayValue('10');
    
    await user.selectOptions(pageSizeSelect, '50');
    expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith(50);
    
    await user.selectOptions(pageSizeSelect, '5');
    expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith(5);
  });

  it('calls onPageChange when current page is clicked', async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const currentPageButton = screen.getByRole('button', { name: /go to page 3/i });
    await user.click(currentPageButton);
    
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
  });

  it('handles ellipsis clicks gracefully', async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} totalPages={20} currentPage={10} />);
    
    const ellipsisElements = screen.getAllByText('...');
    await user.click(ellipsisElements[0]);
    
    // Ellipsis should not trigger page change
    expect(defaultProps.onPageChange).not.toHaveBeenCalled();
  });
});
