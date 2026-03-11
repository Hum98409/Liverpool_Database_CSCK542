import { screen } from '@testing-library/react';
import NavMenu from './NavMenu';
import { renderWithProviders } from '../../test/renderWithProviders';

describe('NavMenu', () => {
  test('shows navigation items', () => {
    renderWithProviders(<NavMenu />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Queries/i)).toBeInTheDocument();
    expect(screen.getByText(/Reports/i)).toBeInTheDocument();
  });
});