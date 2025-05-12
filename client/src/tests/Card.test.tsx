import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, test, expect, beforeEach } from 'vitest';
import { Card } from './Card';
import type { GraphNode } from './types';

const mockSelectedNode: GraphNode = {
  id: '1',
  label: 'Movie',
  properties: {
    title: 'Test Movie',
    released: { low: 2023 },
    rating: 8.5,
    voteCount: 100,
  },
};

const mockSetSelectedNode = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
});


test('calls setSelectedNode(null) on close button click', () => {
  render(<Card selectedNode={mockSelectedNode} setSelectedNode={mockSetSelectedNode} />);

  const closeButton = screen.getByText(/Close/i);
  fireEvent.click(closeButton);

  expect(mockSetSelectedNode).toHaveBeenCalledWith(null);
});

test('submits a vote and updates voteMessage', async () => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    json: () => Promise.resolve({ rating: 9.1, voteCount: 101 }),
  }) as any;

  render(<Card selectedNode={mockSelectedNode} setSelectedNode={mockSetSelectedNode} />);

  fireEvent.change(screen.getByLabelText(/Your vote:/), { target: { value: '9' } });
  fireEvent.click(screen.getByText(/Submit Vote/));

  await waitFor(() => {
    expect(screen.getByText(/Thanks for voting!/)).toBeInTheDocument();
  });

  expect(mockSetSelectedNode).toHaveBeenCalled();
});
