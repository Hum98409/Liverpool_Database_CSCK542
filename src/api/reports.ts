import { apiGet } from './client';
import type { GenericRow } from '../types/queries';

/**
 * Fetches the lecturer publications report for a given year.
 *
 * Optionally filters the report by department when a department ID is provided.
 * Returns a list of report rows.
 */
export function getLecturerPublicationsReport(year: number, departmentId?: number) {
  // Start with the required year parameter for the report request.
  const params = new URLSearchParams({ year: String(year) });

  // Add the optional department filter when a department ID is provided.
  if (departmentId) params.set('departmentId', String(departmentId));

  // Request the lecturer publications report with the assembled query parameters.
  return apiGet<{ data: GenericRow[] }>(`/reports/lecturer-publications?${params.toString()}`);
}