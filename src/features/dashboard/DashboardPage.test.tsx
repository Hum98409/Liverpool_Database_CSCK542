import { screen } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import { renderWithProviders } from '../../test/renderWithProviders';

describe('DashboardPage', () => {
  test('renders loading state first', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText(/Loading dashboard/i)).toBeInTheDocument();
  });

  test('renders dashboard cards after loading', async () => {
    renderWithProviders(<DashboardPage />);
    expect(await screen.findByText(/Total Students/i)).toBeInTheDocument();
    expect(await screen.findByText('4')).toBeInTheDocument();
    expect(await screen.findByText(/Current Semester/i)).toBeInTheDocument();
  });
});