import { createBrowserRouter } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import QueryCenterPage from '../features/queries/QueryCenterPage';
import ReportsPage from '../features/reports/ReportsPage';

// Define the application's route tree, including public and protected pages.
export const router = createBrowserRouter([
  {
    // Public login route available without authentication.
    path: '/login',
    element: <LoginPage />,
  },
  {
    // Wrap all authenticated routes in a protection layer.
    element: <ProtectedRoute />,
    children: [
      {
        // Main application shell shown after login.
        path: '/',
        element: <AppShell />,
        children: [
          // Default route for the app root.
          { index: true, element: <DashboardPage /> },
          {
            // Restrict the queries page to users with the teacher role only.
            element: <ProtectedRoute allowedRoles={['teacher']} />,
            children: [{ path: 'queries', element: <QueryCenterPage /> }],
          },
          {
            // Restrict the reports page to teachers and non-academic staff.
            element: <ProtectedRoute allowedRoles={['teacher', 'non_academic_staff']} />,
            children: [{ path: 'reports', element: <ReportsPage /> }],
          },
        ],
      },
    ],
  },
]);