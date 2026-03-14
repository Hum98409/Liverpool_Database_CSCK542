import { http, HttpResponse } from 'msw';
import {
  courseLecturers,
  courseOfferings,
  courses,
  departments,
  enrollments,
  lecturerExpertise,
  lecturerInterests,
  lecturerPublications,
  lecturers,
  nonAcademicStaff,
  programs,
  researchProjectMembersLecturers,
  researchProjectMembersStudents,
  semesters,
  studentEmployment,
  studentGrades,
  students,
} from './data';
import { mockCredentials } from './data';

const baseUrl = 'http://localhost:8000/api';
const currentSemester = semesters.find((s) => s.is_current)!;

function averageForStudent(studentId: number) {
  const grades = studentGrades.filter((g) => g.student_id === studentId);
  if (!grades.length) return 0;
  return grades.reduce((sum, g) => sum + g.score_percent, 0) / grades.length;
}

export const handlers = [
  http.get(`${baseUrl}/auth/login`, ({ request }) => {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const password = url.searchParams.get('password');

    if (role === 'teacher' && password === mockCredentials.teacher) {
      return HttpResponse.json({
        user: { role: 'teacher' },
      });
    }

    if (role === 'student' && password === mockCredentials.student) {
      return HttpResponse.json({
        user: { role: 'student' },
      });
    }

    if (role === 'non_academic_staff' && password === mockCredentials.non_academic_staff) {
      return HttpResponse.json({
        user: { role: 'non_academic_staff' },
      });
    }

    return HttpResponse.json(
      { message: 'Invalid role or password.' },
      { status: 401 }
    );
  }),

  http.get(`${baseUrl}/dashboard/summary`, () => {
    return HttpResponse.json({
      totalStudents: students.length,
      totalLecturers: lecturers.length,
      totalCourses: courses.length,
      totalDepartments: departments.length,
      currentSemester: currentSemester.code,
    });
  }),

  http.get(`${baseUrl}/lookups/students`, () => {
    return HttpResponse.json({ data: students.map((s) => ({ label: s.full_name, value: s.student_id })) });
  }),

  http.get(`${baseUrl}/lookups/lecturers`, () => {
    return HttpResponse.json({ data: lecturers.map((l) => ({ label: l.full_name, value: l.lecturer_id })) });
  }),

  http.get(`${baseUrl}/lookups/course-offerings`, () => {
    return HttpResponse.json({
      data: courseOfferings.map((co) => ({
        label: `${co.course_code} - Section ${co.section}`,
        value: co.course_offering_id,
      })),
    });
  }),

  http.get(`${baseUrl}/lookups/semesters`, () => {
    return HttpResponse.json({ data: semesters.map((s) => ({ label: s.code, value: s.semester_id })) });
  }),

  http.get(`${baseUrl}/lookups/departments`, () => {
    return HttpResponse.json({ data: departments.map((d) => ({ label: d.name, value: d.department_id })) });
  }),

  http.get(`${baseUrl}/lookups/programs`, () => {
    return HttpResponse.json({ data: programs.map((p) => ({ label: p.name, value: p.program_id })) });
  }),

  http.get(`${baseUrl}/queries/students-by-course-and-lecturer`, ({ request }) => {
    const url = new URL(request.url);
    const courseOfferingId = Number(url.searchParams.get('courseOfferingId'));
    const lecturerId = Number(url.searchParams.get('lecturerId'));

    const teachingLink = courseLecturers.find(
      (link) => link.course_offering_id === courseOfferingId && link.lecturer_id === lecturerId
    );

    if (!teachingLink) return HttpResponse.json({ data: [] });

    const rows = enrollments
      .filter((e) => e.course_offering_id === courseOfferingId)
      .map((e) => {
        const student = students.find((s) => s.student_id === e.student_id)!;
        return {
          student_id: student.student_id,
          full_name: student.full_name,
          year_of_study: student.year_of_study,
          graduation_status: student.graduation_status,
          enrollment_status: e.status,
        };
      });

    return HttpResponse.json({ data: rows });
  }),

  http.get(`${baseUrl}/queries/final-year-top-students`, ({ request }) => {
    const url = new URL(request.url);
    const minAverage = Number(url.searchParams.get('minAverage') ?? 70);

    const rows = students
      .filter((student) => student.graduation_status === 'Final Year')
      .map((student) => {
        const program = programs.find((p) => p.program_id === student.program_id)!;
        return {
          student_id: student.student_id,
          full_name: student.full_name,
          program_name: program.name,
          year_of_study: student.year_of_study,
          average_score: Number(averageForStudent(student.student_id).toFixed(1)),
        };
      })
      .filter((row) => row.average_score > minAverage);

    return HttpResponse.json({ data: rows });
  }),

  http.get(`${baseUrl}/queries/unregistered-current-semester`, ({ request }) => {
    const url = new URL(request.url);
    const semesterId = Number(url.searchParams.get('semesterId') ?? currentSemester.semester_id);

    const offeringIds = courseOfferings
      .filter((co) => co.semester_id === semesterId)
      .map((co) => co.course_offering_id);

    const registeredStudentIds = new Set(
      enrollments
        .filter((e) => offeringIds.includes(e.course_offering_id))
        .map((e) => e.student_id)
    );

    const rows = students
      .filter((s) => !registeredStudentIds.has(s.student_id))
      .map((student) => {
        const program = programs.find((p) => p.program_id === student.program_id)!;
        const advisor = lecturers.find((l) => l.lecturer_id === student.advisor_lecturer_id)!;
        return {
          student_id: student.student_id,
          full_name: student.full_name,
          program_name: program.name,
          advisor_name: advisor.full_name,
        };
      });

    return HttpResponse.json({ data: rows });
  }),

  http.get(`${baseUrl}/queries/student-advisor-contact`, ({ request }) => {
    const url = new URL(request.url);
    const studentId = Number(url.searchParams.get('studentId'));
    const student = students.find((s) => s.student_id === studentId);

    if (!student) return HttpResponse.json({ data: null }, { status: 404 });

    const advisor = lecturers.find((l) => l.lecturer_id === student.advisor_lecturer_id)!;
    const department = departments.find((d) => d.department_id === advisor.department_id)!;

    return HttpResponse.json({
      data: {
        student_name: student.full_name,
        advisor_name: advisor.full_name,
        advisor_email: advisor.email,
        department_name: department.name,
      },
    });
  }),

  http.get(`${baseUrl}/queries/lecturers-by-research-area`, ({ request }) => {
    const url = new URL(request.url);
    const keyword = (url.searchParams.get('keyword') ?? '').toLowerCase();

    const rows = lecturers
      .map((lecturer) => {
        const department = departments.find((d) => d.department_id === lecturer.department_id)!;
        const expertiseMatches = lecturerExpertise
          .filter((e) => e.lecturer_id === lecturer.lecturer_id && e.expertise_name.toLowerCase().includes(keyword))
          .map((e) => e.expertise_name);

        const interestMatches = lecturerInterests
          .filter((i) => i.lecturer_id === lecturer.lecturer_id && i.interest_name.toLowerCase().includes(keyword))
          .map((i) => i.interest_name);

        return {
          lecturer_id: lecturer.lecturer_id,
          full_name: lecturer.full_name,
          department_name: department.name,
          matched_expertise: expertiseMatches.join(', '),
          matched_interest: interestMatches.join(', '),
        };
      })
      .filter((row) => row.matched_expertise || row.matched_interest);

    return HttpResponse.json({ data: rows });
  }),

  http.get(`${baseUrl}/queries/courses-by-department`, ({ request }) => {
    const url = new URL(request.url);
    const departmentId = Number(url.searchParams.get('departmentId'));

    const rows = courseOfferings.flatMap((offering) => {
      const course = courses.find((c) => c.course_code === offering.course_code);
      if (!course || course.department_id !== departmentId) return [];

      const semester = semesters.find((s) => s.semester_id === offering.semester_id)!;

      return courseLecturers
        .filter((cl) => cl.course_offering_id === offering.course_offering_id)
        .map((cl) => {
          const lecturer = lecturers.find((l) => l.lecturer_id === cl.lecturer_id)!;
          return {
            course_code: course.course_code,
            course_name: course.name,
            lecturer_name: lecturer.full_name,
            semester: semester.code,
            section: offering.section,
          };
        });
    });

    return HttpResponse.json({ data: rows });
  }),

  http.get(`${baseUrl}/queries/top-project-supervisors`, ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? 10);

    const projectIdsWithStudents = new Set(
      researchProjectMembersStudents.map((row) => row.research_project_id)
    );

    const rows = lecturers
      .map((lecturer) => {
        const department = departments.find((d) => d.department_id === lecturer.department_id)!;

        const supervisedCount = new Set(
          researchProjectMembersLecturers
            .filter(
              (row) =>
                row.lecturer_id === lecturer.lecturer_id &&
                projectIdsWithStudents.has(row.research_project_id)
            )
            .map((row) => row.research_project_id)
        ).size;

        return {
          lecturer_id: lecturer.lecturer_id,
          lecturer_name: lecturer.full_name,
          department_name: department.name,
          supervised_project_count: supervisedCount,
        };
      })
      .sort((a, b) => b.supervised_project_count - a.supervised_project_count)
      .slice(0, limit);

    return HttpResponse.json({ data: rows });
  }),

  http.get(`${baseUrl}/reports/lecturer-publications`, ({ request }) => {
    const url = new URL(request.url);
    const year = Number(url.searchParams.get('year') ?? 2025);
    const departmentId = Number(url.searchParams.get('departmentId') ?? 0);

    const rows = lecturerPublications
      .filter((p) => new Date(p.publication_date).getFullYear() >= year - 1)
      .map((p) => {
        const lecturer = lecturers.find((l) => l.lecturer_id === p.lecturer_id)!;
        const department = departments.find((d) => d.department_id === lecturer.department_id)!;
        return {
          publication_id: p.publication_id,
          lecturer_name: lecturer.full_name,
          department_name: department.name,
          title: p.title,
          venue: p.venue,
          publication_date: p.publication_date,
          doi: p.doi,
        };
      })
      .filter((row) => {
        if (!departmentId) return true;
        const department = departments.find((d) => d.name === row.department_name);
        return department?.department_id === departmentId;
      });

    return HttpResponse.json({ data: rows });
  }),

  http.get(`${baseUrl}/queries/students-by-advisor`, ({ request }) => {
    const url = new URL(request.url);
    const lecturerId = Number(url.searchParams.get('lecturerId'));

    const rows = students
      .filter((s) => s.advisor_lecturer_id === lecturerId)
      .map((student) => {
        const program = programs.find((p) => p.program_id === student.program_id)!;
        return {
          student_id: student.student_id,
          full_name: student.full_name,
          program_name: program.name,
          year_of_study: student.year_of_study,
          graduation_status: student.graduation_status,
        };
      });

    return HttpResponse.json({ data: rows });
  }),

  http.get(`${baseUrl}/queries/staff-by-department`, ({ request }) => {
    const url = new URL(request.url);
    const departmentId = Number(url.searchParams.get('departmentId'));

    const department = departments.find((d) => d.department_id === departmentId)!;

    const lecturerRows = lecturers
      .filter((lecturer) => lecturer.department_id === departmentId)
      .map((lecturer) => ({
        full_name: lecturer.full_name,
        staff_type: 'Lecturer',
        job_title: 'Lecturer',
        department_name: department.name,
        email: lecturer.email,
      }));

    const nonAcademicRows = nonAcademicStaff
      .filter((staff) => staff.department_id === departmentId)
      .map((staff) => ({
        full_name: staff.full_name,
        staff_type: 'Non-Academic Staff',
        job_title: staff.job_title,
        department_name: department.name,
        email: '',
      }));

    return HttpResponse.json({ data: [...lecturerRows, ...nonAcademicRows] });
  }),

  http.get(`${baseUrl}/queries/program-student-employee-supervisors`, ({ request }) => {
    const url = new URL(request.url);
    const programId = Number(url.searchParams.get('programId'));

    const rows = studentEmployment
      .filter((employment) => employment.program_id === programId)
      .map((employment) => {
        const student = students.find((s) => s.student_id === employment.student_id)!;
        const supervisor = nonAcademicStaff.find(
          (staff) => staff.staff_id === employment.supervisor_staff_id
        )!;
        const program = programs.find((p) => p.program_id === employment.program_id)!;
        const department = departments.find((d) => d.department_id === program.department_id)!;

        return {
          supervisor_name: supervisor.full_name,
          supervisor_job_title: supervisor.job_title,
          student_employee_name: student.full_name,
          student_job_title: employment.job_title,
          program_name: program.name,
          department_name: department.name,
        };
      });

    return HttpResponse.json({ data: rows });
  }),
];