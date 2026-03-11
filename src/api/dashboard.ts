import { apiGet } from './client';
import type { DashboardSummary } from '../types/queries';

export function getDashboardSummary() {
  return apiGet<DashboardSummary>('/dashboard/summary');
}