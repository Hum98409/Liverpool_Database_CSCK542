import { screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import NavMenu from './NavMenu';
import { renderWithProviders } from '../../test/renderWithProviders';

describe('NavMenu', () => {
  test('teacher sees dashboard queries and reports', () => {
    renderWithProviders(<NavMenu />, {
      initialUser: { role: 'teacher' },
    });

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Queries/i)).toBeInTheDocument();
    expect(screen.getByText(/Reports/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test('student sees dashboard only', () => {
    renderWithProviders(<NavMenu />, {
      initialUser: { role: 'student' },
    });

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/Queries/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Reports/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test('non academic staff sees dashboard and reports only', () => {
    renderWithProviders(<NavMenu />, {
      initialUser: { role: 'non_academic_staff' },
    });

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/Queries/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Reports/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
});