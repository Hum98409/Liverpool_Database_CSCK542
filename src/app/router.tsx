import { createBrowserRouter } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import QueryCenterPage from '../features/queries/QueryCenterPage';
import ReportsPage from '../features/reports/ReportsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            element: <ProtectedRoute allowedRoles={['teacher']} />,
            children: [{ path: 'queries', element: <QueryCenterPage /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={['teacher', 'non_academic_staff']} />,
            children: [{ path: 'reports', element: <ReportsPage /> }],
          },
        ],
      },
    ],
  },
]);