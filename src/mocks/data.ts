import type {
  Course,
  CourseOffering,
  Department,
  Lecturer,
  LecturerExpertise,
  LecturerInterest,
  LecturerPublication,
  NonAcademicStaff,
  Program,
  ResearchProject,
  ResearchProjectMemberLecturer,
  ResearchProjectMemberStudent,
  Semester,
  Student,
  StudentEmployment,
} from '../types/domain';

export const departments: Department[] = [
  { department_id: 1, name: 'Computer Science', faculty: 'Science', created_at: '2024-01-01' },
  { department_id: 2, name: 'Information Systems', faculty: 'Science', created_at: '2024-01-01' },
  { department_id: 3, name: 'Mathematics', faculty: 'Science', created_at: '2024-01-01' },
];

export const programs: Program[] = [
  {
    program_id: 1,
    department_id: 1,
    name: 'BSc Computer Science',
    degree_awarded: 'BSc',
    duration_years: 4,
    created_at: '2024-01-01',
  },
  {
    program_id: 2,
    department_id: 2,
    name: 'BSc Information Systems',
    degree_awarded: 'BSc',
    duration_years: 4,
    created_at: '2024-01-01',
  },
];

export const lecturers: Lecturer[] = [
  {
    lecturer_id: 1,
    department_id: 1,
    full_name: 'Dr Jane Smith',
    email: 'jane.smith@university.edu',
    course_load: 3,
    created_at: '2024-01-01',
  },
  {
    lecturer_id: 2,
    department_id: 1,
    full_name: 'Dr Peter Brown',
    email: 'peter.brown@university.edu',
    course_load: 2,
    created_at: '2024-01-01',
  },
  {
    lecturer_id: 3,
    department_id: 2,
    full_name: 'Prof Mary Dube',
    email: 'mary.dube@university.edu',
    course_load: 2,
    created_at: '2024-01-01',
  },
];

export const lecturerExpertise: LecturerExpertise[] = [
  { expertise_id: 1, lecturer_id: 1, expertise_name: 'Databases', created_at: '2024-01-01' },
  { expertise_id: 2, lecturer_id: 1, expertise_name: 'Data Engineering', created_at: '2024-01-01' },
  { expertise_id: 3, lecturer_id: 2, expertise_name: 'Software Engineering', created_at: '2024-01-01' },
  { expertise_id: 4, lecturer_id: 2, expertise_name: 'Web Systems', created_at: '2024-01-01' },
  { expertise_id: 5, lecturer_id: 3, expertise_name: 'Information Systems', created_at: '2024-01-01' },
  { expertise_id: 6, lecturer_id: 3, expertise_name: 'Analytics', created_at: '2024-01-01' },
];

export const lecturerInterests: LecturerInterest[] = [
  { interest_id: 1, lecturer_id: 1, interest_name: 'Query optimization', created_at: '2024-01-01' },
  { interest_id: 2, lecturer_id: 1, interest_name: 'Distributed databases', created_at: '2024-01-01' },
  { interest_id: 3, lecturer_id: 2, interest_name: 'Frontend systems', created_at: '2024-01-01' },
  { interest_id: 4, lecturer_id: 2, interest_name: 'Software quality', created_at: '2024-01-01' },
  { interest_id: 5, lecturer_id: 3, interest_name: 'Decision support systems', created_at: '2024-01-01' },
];

export const nonAcademicStaff: NonAcademicStaff[] = [
  {
    staff_id: 1,
    department_id: 1,
    full_name: 'Sarah Mhlanga',
    job_title: 'Lab Coordinator',
    employment_type: 'Full-Time',
    contract_details: 'Permanent',
    salary_amount: 42000,
    salary_currency: 'USD',
    emergency_contact: '011-111-1111',
    created_at: '2024-01-01',
  },
  {
    staff_id: 2,
    department_id: 2,
    full_name: 'John Banda',
    job_title: 'Department Administrator',
    employment_type: 'Full-Time',
    contract_details: 'Permanent',
    salary_amount: 39000,
    salary_currency: 'USD',
    emergency_contact: '022-222-2222',
    created_at: '2024-01-01',
  },
];

export const students: Student[] = [
  {
    student_id: 1,
    program_id: 1,
    advisor_lecturer_id: 1,
    full_name: 'Alice Ndlovu',
    date_of_birth: '2002-03-02',
    year_of_study: 4,
    graduation_status: 'Final Year',
    created_at: '2024-01-01',
  },
  {
    student_id: 2,
    program_id: 2,
    advisor_lecturer_id: 3,
    full_name: 'Brian Moyo',
    date_of_birth: '2002-07-12',
    year_of_study: 4,
    graduation_status: 'Final Year',
    created_at: '2024-01-01',
  },
  {
    student_id: 3,
    program_id: 1,
    advisor_lecturer_id: 2,
    full_name: 'Chipo Dlamini',
    date_of_birth: '2003-04-18',
    year_of_study: 3,
    graduation_status: 'Continuing',
    created_at: '2024-01-01',
  },
  {
    student_id: 4,
    program_id: 1,
    advisor_lecturer_id: 1,
    full_name: 'David Zhou',
    date_of_birth: '2001-10-09',
    year_of_study: 4,
    graduation_status: 'Final Year',
    created_at: '2024-01-01',
  },
];

export const semesters: Semester[] = [
  {
    semester_id: 1,
    code: '2025-S1',
    start_date: '2025-01-15',
    end_date: '2025-06-01',
    is_current: true,
  },
  {
    semester_id: 2,
    code: '2024-S2',
    start_date: '2024-08-01',
    end_date: '2024-12-01',
    is_current: false,
  },
];

export const courses: Course[] = [
  {
    course_code: 'CSC401',
    department_id: 1,
    name: 'Advanced Databases',
    description: 'Database systems and advanced query processing',
    level: 4,
    credits: 12,
    created_at: '2024-01-01',
  },
  {
    course_code: 'CSC320',
    department_id: 1,
    name: 'Web Application Development',
    description: 'Modern web UI and backend integration',
    level: 3,
    credits: 12,
    created_at: '2024-01-01',
  },
  {
    course_code: 'INS410',
    department_id: 2,
    name: 'Business Analytics',
    description: 'Applied analytics for organisations',
    level: 4,
    credits: 12,
    created_at: '2024-01-01',
  },
];

export const courseOfferings: CourseOffering[] = [
  {
    course_offering_id: 1,
    course_code: 'CSC401',
    semester_id: 1,
    section: 'A',
    schedule_text: 'Mon 10:00-12:00',
  },
  {
    course_offering_id: 2,
    course_code: 'CSC320',
    semester_id: 1,
    section: 'A',
    schedule_text: 'Tue 09:00-11:00',
  },
  {
    course_offering_id: 3,
    course_code: 'INS410',
    semester_id: 1,
    section: 'B',
    schedule_text: 'Wed 14:00-16:00',
  },
];

export const enrollments = [
  { enrollment_id: 1, student_id: 1, course_offering_id: 1, enrolled_at: '2025-01-10', status: 'Enrolled' },
  { enrollment_id: 2, student_id: 1, course_offering_id: 2, enrolled_at: '2025-01-10', status: 'Enrolled' },
  { enrollment_id: 3, student_id: 2, course_offering_id: 3, enrolled_at: '2025-01-10', status: 'Enrolled' },
  { enrollment_id: 4, student_id: 3, course_offering_id: 2, enrolled_at: '2025-01-10', status: 'Enrolled' },
];

export const studentGrades = [
  { grade_id: 1, student_id: 1, course_offering_id: 1, assessment_name: 'Final', score_percent: 82, graded_at: '2025-05-20' },
  { grade_id: 2, student_id: 1, course_offering_id: 2, assessment_name: 'Final', score_percent: 75, graded_at: '2025-05-20' },
  { grade_id: 3, student_id: 2, course_offering_id: 3, assessment_name: 'Final', score_percent: 74, graded_at: '2025-05-20' },
  { grade_id: 4, student_id: 3, course_offering_id: 2, assessment_name: 'Final', score_percent: 66, graded_at: '2025-05-20' },
  { grade_id: 5, student_id: 4, course_offering_id: 1, assessment_name: 'Final', score_percent: 88, graded_at: '2025-05-20' },
];

export const courseLecturers = [
  { course_offering_id: 1, lecturer_id: 1 },
  { course_offering_id: 2, lecturer_id: 2 },
  { course_offering_id: 3, lecturer_id: 3 },
];

export const researchProjects: ResearchProject[] = [
  {
    research_project_id: 1,
    principal_investigator_lecturer_id: 1,
    title: 'Distributed Query Planner',
    start_date: '2025-01-10',
    end_date: null,
    outcome: 'In Progress',
    created_at: '2025-01-01',
  },
  {
    research_project_id: 2,
    principal_investigator_lecturer_id: 1,
    title: 'Database Tuning Dashboard',
    start_date: '2025-02-01',
    end_date: null,
    outcome: 'In Progress',
    created_at: '2025-02-01',
  },
  {
    research_project_id: 3,
    principal_investigator_lecturer_id: 2,
    title: 'Frontend Testing Portal',
    start_date: '2025-03-01',
    end_date: null,
    outcome: 'In Progress',
    created_at: '2025-03-01',
  },
];

export const researchProjectMembersLecturers: ResearchProjectMemberLecturer[] = [
  { research_project_id: 1, lecturer_id: 1, member_role: 'Principal Investigator', created_at: '2025-01-01' },
  { research_project_id: 2, lecturer_id: 1, member_role: 'Principal Investigator', created_at: '2025-02-01' },
  { research_project_id: 3, lecturer_id: 2, member_role: 'Principal Investigator', created_at: '2025-03-01' },
];

export const researchProjectMembersStudents: ResearchProjectMemberStudent[] = [
  { research_project_id: 1, student_id: 1, member_role: 'Research Assistant', created_at: '2025-01-01' },
  { research_project_id: 2, student_id: 4, member_role: 'Research Assistant', created_at: '2025-02-01' },
  { research_project_id: 3, student_id: 3, member_role: 'Research Assistant', created_at: '2025-03-01' },
];

export const lecturerPublications: LecturerPublication[] = [
  {
    publication_id: 1,
    lecturer_id: 1,
    research_project_id: 1,
    title: 'Scalable SQL Query Optimisation',
    publication_date: '2025-02-10',
    venue: 'Journal of Database Systems',
    doi: '10.1000/jds.2025.001',
  },
  {
    publication_id: 2,
    lecturer_id: 2,
    research_project_id: 3,
    title: 'Testing Modern User Interfaces',
    publication_date: '2025-03-04',
    venue: 'Software Engineering Review',
    doi: '10.1000/ser.2025.015',
  },
  {
    publication_id: 3,
    lecturer_id: 3,
    research_project_id: null,
    title: 'Analytics for Academic Decision Systems',
    publication_date: '2024-11-18',
    venue: 'Information Systems Quarterly',
    doi: '10.1000/isq.2024.220',
  },
];

export const studentEmployment: StudentEmployment[] = [
  {
    employment_id: 1,
    student_id: 1,
    program_id: 1,
    supervisor_staff_id: 1,
    job_title: 'Teaching Assistant',
    start_date: '2025-02-01',
    end_date: null,
    created_at: '2025-02-01',
  },
  {
    employment_id: 2,
    student_id: 3,
    program_id: 1,
    supervisor_staff_id: 1,
    job_title: 'Research Assistant',
    start_date: '2025-02-15',
    end_date: null,
    created_at: '2025-02-15',
  },
];

export const mockCredentials = {
  teacher: 'teacher123',
  student: 'student123',
  non_academic_staff: 'staff123',
} as const;