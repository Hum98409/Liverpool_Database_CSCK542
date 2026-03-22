import { apiGet } from './client';
import type { GenericRow } from '../types/queries';

/**
 * Fetches students assigned to a specific course offering and lecturer.
 *
 * Returns a list of matching student rows.
 */
export function getStudentsByCourseAndLecturer(courseOfferingId: number, lecturerId: number) {
  // Request students filtered by both course offering and lecturer.
  return apiGet<{ data: GenericRow[] }>(
    `/queries/students-by-course-and-lecturer?courseOfferingId=${courseOfferingId}&lecturerId=${lecturerId}`
  );
}

/**
 * Fetches final-year students whose average meets or exceeds the given threshold.
 *
 * Returns a list of qualifying student rows.
 */
export function getFinalYearTopStudents(minAverage: number) {
  // Request final-year top students using the minimum average filter.
  return apiGet<{ data: GenericRow[] }>(`/queries/final-year-top-students?minAverage=${minAverage}`);
}

/**
 * Fetches students who have not registered for the specified semester.
 *
 * Returns a list of unregistered student rows.
 */
export function getUnregisteredCurrentSemester(semesterId: number) {
  // Request students missing registration for the selected semester.
  return apiGet<{ data: GenericRow[] }>(`/queries/unregistered-current-semester?semesterId=${semesterId}`);
}

/**
 * Fetches the advisor contact details for a specific student.
 *
 * Returns a single row or null when no advisor information is found.
 */
export function getStudentAdvisorContact(studentId: number) {
  // Request advisor contact information for the given student.
  return apiGet<{ data: GenericRow | null }>(`/queries/student-advisor-contact?studentId=${studentId}`);
}

/**
 * Fetches lecturers whose research area matches the provided keyword.
 *
 * Returns a list of lecturer rows matching the search term.
 */
export function getLecturersByResearchArea(keyword: string) {
  // Encode the keyword to safely include it in the query string.
  return apiGet<{ data: GenericRow[] }>(
    `/queries/lecturers-by-research-area?keyword=${encodeURIComponent(keyword)}`
  );
}

/**
 * Fetches courses that belong to a specific department.
 *
 * Returns a list of course rows for the department.
 */
export function getCoursesByDepartment(departmentId: number) {
  // Request department courses using the department identifier.
  return apiGet<{ data: GenericRow[] }>(`/queries/courses-by-department?departmentId=${departmentId}`);
}

/**
 * Fetches the top project supervisors up to the provided limit.
 *
 * Returns a ranked list of supervisor rows.
 */
export function getTopProjectSupervisors(limit: number) {
  // Request top project supervisors with a maximum number of results.
  return apiGet<{ data: GenericRow[] }>(`/queries/top-project-supervisors?limit=${limit}`);
}

/**
 * Fetches students assigned to a specific academic advisor.
 *
 * Returns a list of student rows for the lecturer.
 */
export function getStudentsByAdvisor(lecturerId: number) {
  // Request students supervised or advised by the given lecturer.
  return apiGet<{ data: GenericRow[] }>(`/queries/students-by-advisor?lecturerId=${lecturerId}`);
}

/**
 * Fetches staff members in a specific department.
 *
 * Returns a list of staff rows for the department.
 */
export function getStaffByDepartment(departmentId: number) {
  // Request department staff using the department identifier.
  return apiGet<{ data: GenericRow[] }>(`/queries/staff-by-department?departmentId=${departmentId}`);
}

/**
 * Fetches program students together with their employee supervisors.
 *
 * Returns a list of rows linking students and supervisors for the program.
 */
export function getProgramStudentEmployeeSupervisors(programId: number) {
  // Request program student and employee supervisor relationships.
  return apiGet<{ data: GenericRow[] }>(
    `/queries/program-student-employee-supervisors?programId=${programId}`
  );
}