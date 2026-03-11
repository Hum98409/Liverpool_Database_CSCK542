import { createBrowserRouter } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import DashboardPage from '../features/dashboard/DashboardPage';
import QueryCenterPage from '../features/queries/QueryCenterPage';
import ReportsPage from '../features/reports/ReportsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'queries', element: <QueryCenterPage /> },
      { path: 'reports', element: <ReportsPage /> },
    ],
  },
]);