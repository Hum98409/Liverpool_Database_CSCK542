export type Department = {
  department_id: number;
  name: string;
  faculty: string;
  created_at: string;
};

export type Program = {
  program_id: number;
  department_id: number;
  name: string;
  degree_awarded: string;
  duration_years: number;
  enrolment_details: string;
  created_at: string;
};

export type Lecturer = {
  lecturer_id: number;
  department_id: number;
  full_name: string;
  email: string;
  areas_of_expertise: string;
  research_interests: string;
  created_at: string;
};

export type Student = {
  student_id: number;
  program_id: number;
  advisor_lecturer_id: number;
  full_name: string;
  date_of_birth: string;
  year_of_study: number;
  graduation_status: string;
  created_at: string;
};

export type Semester = {
  semester_id: number;
  code: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
};

export type Course = {
  course_code: string;
  department_id: number;
  name: string;
  description: string;
  level: number;
  credits: number;
  created_at: string;
};

export type CourseOffering = {
  course_offering_id: number;
  course_code: string;
  semester_id: number;
  section: string;
  schedule_text: string;
};

export type LecturerPublication = {
  publication_id: number;
  lecturer_id: number;
  title: string;
  publication_date: string;
  venue: string;
  doi: string;
};