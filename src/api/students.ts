import { apiGet } from './client';

/**
 * Represents a student record returned by the API.
 */
export type StudentRecord = {
  // Unique identifier for the student.
  id: number;

  // Full name of the student.
  name: string;

  // Email address of the student.
  email: string;
};

/**
 * Fetches the list of students from the API.
 *
 * Returns an array of student records.
 */
export function getStudents() {
  // Request all students and return the typed response.
  return apiGet<StudentRecord[]>('/students');
}