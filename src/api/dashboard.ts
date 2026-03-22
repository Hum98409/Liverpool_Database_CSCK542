import { apiGet } from './client';
import type { DashboardSummary } from '../types/queries';

/**
 * Fetches the summary data displayed on the dashboard.
 *
 * Returns the API response typed as DashboardSummary.
 */
export function getDashboardSummary() {
  // Request the dashboard summary endpoint and return the typed result.
  return apiGet<DashboardSummary>('/dashboard/summary');
}