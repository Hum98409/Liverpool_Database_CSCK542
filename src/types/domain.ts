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

export type Lecturer = {
  lecturer_id: number;
  department_id: number;
  full_name: string;
  email: string;
  course_load: number;
  created_at: string;
};

export type LecturerExpertise = {
  expertise_id: number;
  lecturer_id: number;
  expertise_name: string;
  created_at: string;
};

export type LecturerInterest = {
  interest_id: number;
  lecturer_id: number;
  interest_name: string;
  created_at: string;
};

export type LecturerPublication = {
  publication_id: number;
  lecturer_id: number;
  research_project_id: number | null;
  title: string;
  publication_date: string;
  venue: string;
  doi: string;
};

export type NonAcademicStaff = {
  staff_id: number;
  department_id: number;
  full_name: string;
  job_title: string;
  employment_type: string;
  contract_details: string;
  salary_amount: number;
  salary_currency: string;
  emergency_contact: string;
  created_at: string;
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

export type Semester = {
  semester_id: number;
  code: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
};

export type ResearchProject = {
  research_project_id: number;
  principal_investigator_lecturer_id: number;
  title: string;
  start_date: string;
  end_date: string | null;
  outcome: string;
  created_at: string;
};

export type ResearchProjectMemberStudent = {
  research_project_id: number;
  student_id: number;
  member_role: string;
  created_at: string;
};

export type ResearchProjectMemberLecturer = {
  research_project_id: number;
  lecturer_id: number;
  member_role: string;
  created_at: string;
};

export type StudentEmployment = {
  employment_id: number;
  student_id: number;
  program_id: number;
  supervisor_staff_id: number;
  job_title: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
};