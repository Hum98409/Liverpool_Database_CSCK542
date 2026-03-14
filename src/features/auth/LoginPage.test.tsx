import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';
import LoginPage from './LoginPage';
import { renderWithProviders } from '../../test/renderWithProviders';

describe('LoginPage', () => {
  test('renders title and fields', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText(/Database Management System/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('shows error on invalid login', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText(/Password/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /Login/i }));

    expect(await screen.findByText(/Invalid role or password/i)).toBeInTheDocument();
  });

  test('allows successful teacher login', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText(/Password/i), 'teacher123');
    await user.click(screen.getByRole('button', { name: /Login/i }));

    expect(screen.queryByText(/Invalid role or password/i)).not.toBeInTheDocument();
  });
});