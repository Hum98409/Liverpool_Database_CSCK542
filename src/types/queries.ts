export type LookupOption = {
  label: string;
  value: string | number;
};

export type RowValue = string | number | boolean | null;
export type GenericRow = Record<string, RowValue>;

export type DashboardSummary = {
  totalStudents: number;
  totalLecturers: number;
  totalCourses: number;
  totalDepartments: number;
  currentSemester: string;
};