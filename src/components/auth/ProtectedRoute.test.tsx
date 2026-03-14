import { Route, Routes } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';
import { renderWithProviders } from '../../test/renderWithProviders';

describe('ProtectedRoute', () => {
  test('redirects to login when user is not logged in', () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
          <Route path="/queries" element={<div>Queries Page</div>} />
        </Route>
      </Routes>,
      {
        initialUser: null,
        initialEntries: ['/queries'],
      }
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  test('allows teacher into teacher-only route', () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
          <Route path="/queries" element={<div>Queries Page</div>} />
        </Route>
      </Routes>,
      {
        initialUser: { role: 'teacher' },
        initialEntries: ['/queries'],
      }
    );

    expect(screen.getByText(/Queries Page/i)).toBeInTheDocument();
  });

  test('blocks student from teacher-only route', () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
          <Route path="/queries" element={<div>Queries Page</div>} />
        </Route>
      </Routes>,
      {
        initialUser: { role: 'student' },
        initialEntries: ['/queries'],
      }
    );

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  test('allows non academic staff into reports route', () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute allowedRoles={['teacher', 'non_academic_staff']} />}>
          <Route path="/reports" element={<div>Reports Page</div>} />
        </Route>
      </Routes>,
      {
        initialUser: { role: 'non_academic_staff' },
        initialEntries: ['/reports'],
      }
    );

    expect(screen.getByText(/Reports Page/i)).toBeInTheDocument();
  });
});