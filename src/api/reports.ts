import { apiGet } from './client';
import type { GenericRow } from '../types/queries';

export function getLecturerPublicationsReport(year: number, departmentId?: number) {
  const params = new URLSearchParams({ year: String(year) });
  if (departmentId) params.set('departmentId', String(departmentId));
  return apiGet<{ data: GenericRow[] }>(`/reports/lecturer-publications?${params.toString()}`);
}