import { apiGet } from './client';
import type { LookupOption } from '../types/queries';

export function getStudentsLookup() {
  return apiGet<{ data: LookupOption[] }>('/lookups/students');
}

export function getLecturersLookup() {
  return apiGet<{ data: LookupOption[] }>('/lookups/lecturers');
}

export function getCourseOfferingsLookup() {
  return apiGet<{ data: LookupOption[] }>('/lookups/course-offerings');
}

export function getSemestersLookup() {
  return apiGet<{ data: LookupOption[] }>('/lookups/semesters');
}

export function getDepartmentsLookup() {
  return apiGet<{ data: LookupOption[] }>('/lookups/departments');
}

export function getProgramsLookup() {
  return apiGet<{ data: LookupOption[] }>('/lookups/programs');
}