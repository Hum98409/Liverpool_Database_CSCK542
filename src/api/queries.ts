import { apiGet } from './client';
import type { GenericRow } from '../types/queries';

export function getStudentsByCourseAndLecturer(courseOfferingId: number, lecturerId: number) {
  return apiGet<{ data: GenericRow[] }>(
    `/queries/students-by-course-and-lecturer?courseOfferingId=${courseOfferingId}&lecturerId=${lecturerId}`
  );
}

export function getFinalYearTopStudents(minAverage: number) {
  return apiGet<{ data: GenericRow[] }>(`/queries/final-year-top-students?minAverage=${minAverage}`);
}

export function getUnregisteredCurrentSemester(semesterId: number) {
  return apiGet<{ data: GenericRow[] }>(`/queries/unregistered-current-semester?semesterId=${semesterId}`);
}

export function getStudentAdvisorContact(studentId: number) {
  return apiGet<{ data: GenericRow | null }>(`/queries/student-advisor-contact?studentId=${studentId}`);
}

export function getLecturersByResearchArea(keyword: string) {
  return apiGet<{ data: GenericRow[] }>(
    `/queries/lecturers-by-research-area?keyword=${encodeURIComponent(keyword)}`
  );
}

export function getCoursesByDepartment(departmentId: number) {
  return apiGet<{ data: GenericRow[] }>(`/queries/courses-by-department?departmentId=${departmentId}`);
}

export function getTopProjectSupervisors(limit: number) {
  return apiGet<{ data: GenericRow[] }>(`/queries/top-project-supervisors?limit=${limit}`);
}

export function getStudentsByAdvisor(lecturerId: number) {
  return apiGet<{ data: GenericRow[] }>(`/queries/students-by-advisor?lecturerId=${lecturerId}`);
}

export function getStaffByDepartment(departmentId: number) {
  return apiGet<{ data: GenericRow[] }>(`/queries/staff-by-department?departmentId=${departmentId}`);
}

export function getProgramStudentEmployeeSupervisors(programId: number) {
  return apiGet<{ data: GenericRow[] }>(
    `/queries/program-student-employee-supervisors?programId=${programId}`
  );
}