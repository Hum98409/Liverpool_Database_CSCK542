import { apiGet } from './client';
import type { LookupOption } from '../types/queries';

/**
 * Fetches the student lookup list for dropdowns or selection controls.
 *
 * Returns an object containing an array of lookup options.
 */
export function getStudentsLookup() {
  // Request the students lookup endpoint and return typed lookup data.
  return apiGet<{ data: LookupOption[] }>('/lookups/students');
}

/**
 * Fetches the lecturer lookup list for dropdowns or selection controls.
 *
 * Returns an object containing an array of lookup options.
 */
export function getLecturersLookup() {
  // Request the lecturers lookup endpoint and return typed lookup data.
  return apiGet<{ data: LookupOption[] }>('/lookups/lecturers');
}

/**
 * Fetches the course offerings lookup list for dropdowns or selection controls.
 *
 * Returns an object containing an array of lookup options.
 */
export function getCourseOfferingsLookup() {
  // Request the course offerings lookup endpoint and return typed lookup data.
  return apiGet<{ data: LookupOption[] }>('/lookups/course-offerings');
}

/**
 * Fetches the semesters lookup list for dropdowns or selection controls.
 *
 * Returns an object containing an array of lookup options.
 */
export function getSemestersLookup() {
  // Request the semesters lookup endpoint and return typed lookup data.
  return apiGet<{ data: LookupOption[] }>('/lookups/semesters');
}

/**
 * Fetches the departments lookup list for dropdowns or selection controls.
 *
 * Returns an object containing an array of lookup options.
 */
export function getDepartmentsLookup() {
  // Request the departments lookup endpoint and return typed lookup data.
  return apiGet<{ data: LookupOption[] }>('/lookups/departments');
}

/**
 * Fetches the programs lookup list for dropdowns or selection controls.
 *
 * Returns an object containing an array of lookup options.
 */
export function getProgramsLookup() {
  // Request the programs lookup endpoint and return typed lookup data.
  return apiGet<{ data: LookupOption[] }>('/lookups/programs');
}