import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';
import ReportsPage from './ReportsPage';
import { renderWithProviders } from '../../test/renderWithProviders';

describe('ReportsPage', () => {
  test('renders the reports page', () => {
    renderWithProviders(<ReportsPage />);
    expect(screen.getByText(/Lecturer Publications Report/i)).toBeInTheDocument();
  });

  test('shows report rows', async () => {
    renderWithProviders(<ReportsPage />);
    expect(await screen.findByText(/Scalable SQL Query Optimisation/i)).toBeInTheDocument();
  });

  test('re-generates report for a different year', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReportsPage />);

    const yearInput = screen.getByLabelText(/Year/i);
    await user.clear(yearInput);
    await user.type(yearInput, '2024');
    await user.click(screen.getByRole('button', { name: /Generate Report/i }));

    expect(await screen.findByText(/Testing Modern User Interfaces/i)).toBeInTheDocument();
  });
});