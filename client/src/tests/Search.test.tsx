import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import { Search } from './Search';

test('renders search input and calls handleSearch on button click', () => {
  const mockHandleSearch = vi.fn();

  render(
    <Search
      searchTerm=""
      setSearchTerm={() => {}}
      handleSearch={mockHandleSearch}
      searchResults={[]} 
      onSelectResult={() => {}}
    />
  );

  const button = screen.getByRole('button');
  fireEvent.click(button);

  expect(mockHandleSearch).toHaveBeenCalled();
});
