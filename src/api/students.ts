import { apiGet } from './client';

export type StudentRecord = {
  id: number;
  name: string;
  email: string;
};

export function getStudents() {
  return apiGet<StudentRecord[]>('/students');
}
