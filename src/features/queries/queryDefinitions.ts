export const queryDefinitions = [
  {
    key: 'studentsByCourseAndLecturer',
    title: 'Students in a Specific Course Taught by a Lecturer',
    description: 'Find all students enrolled in a specific course taught by a particular lecturer.',
  },
  {
    key: 'finalYearTopStudents',
    title: 'Final-Year Students Above a Grade Threshold',
    description: 'List final-year students whose average grade is above a selected value.',
  },
  {
    key: 'unregisteredCurrentSemester',
    title: 'Students Not Registered in the Current Semester',
    description: 'Identify students who have not registered for any course in the selected semester.',
  },
  {
    key: 'studentAdvisorContact',
    title: 'Advisor Contact for a Student',
    description: 'Retrieve the contact information for the faculty advisor of a specific student.',
  },
  {
    key: 'lecturersByResearchArea',
    title: 'Lecturers by Expertise or Research Interest',
    description: 'Search for lecturers with expertise or research interest in a particular area.',
  },
  {
    key: 'coursesByDepartment',
    title: 'Courses Taught in a Specific Department',
    description: 'List all courses taught by lecturers in a specific department.',
  },
  {
    key: 'topProjectSupervisors',
    title: 'Lecturers with the Most Supervised Research Projects',
    description: 'Identify lecturers who have supervised the most student research projects.',
  },
  {
    key: 'studentsByAdvisor',
    title: 'Students Advised by a Specific Lecturer',
    description: 'Retrieve the names of students advised by a specific lecturer.',
  },
  {
    key: 'staffByDepartment',
    title: 'Staff Members in a Specific Department',
    description: 'Find all staff members employed in a specific department.',
  },
  {
    key: 'programStudentEmployeeSupervisors',
    title: 'Employees Supervising Student Employees in a Program',
    description: 'Identify employees who supervise student employees in a particular program.',
  },
] as const;

export type QueryKey = (typeof queryDefinitions)[number]['key'];