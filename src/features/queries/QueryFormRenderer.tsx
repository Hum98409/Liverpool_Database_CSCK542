import { useQuery } from '@tanstack/react-query';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import {
  getCoursesByDepartment,
  getFinalYearTopStudents,
  getLecturersByResearchArea,
  getProgramStudentEmployeeSupervisors,
  getStaffByDepartment,
  getStudentAdvisorContact,
  getStudentsByAdvisor,
  getStudentsByCourseAndLecturer,
  getTopProjectSupervisors,
  getUnregisteredCurrentSemester,
} from '../../api/queries';
import {
  getCourseOfferingsLookup,
  getDepartmentsLookup,
  getLecturersLookup,
  getProgramsLookup,
  getSemestersLookup,
  getStudentsLookup,
} from '../../api/lookups';
import DownloadButtons from '../../components/common/DownloadButtons';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import ResultsTable from '../../components/common/ResultsTable';
import type { GenericRow } from '../../types/queries';
import type { QueryKey } from './queryDefinitions';

/**
 * Renders the input form and results area for the selected query.
 *
 * Handles query-specific parameters, loads lookup options for select fields,
 * runs the selected query on demand, and displays results with export actions.
 */
export default function QueryFormRenderer({ queryKey }: { queryKey: QueryKey }) {
  // Selected course offering for queries that filter by course offering.
  const [courseOfferingId, setCourseOfferingId] = useState<number | ''>('');

  // Selected lecturer for lecturer-based queries.
  const [lecturerId, setLecturerId] = useState<number | ''>('');

  // Minimum grade threshold for top final-year student queries.
  const [minAverage, setMinAverage] = useState<number>(70);

  // Selected semester for semester-based queries.
  const [semesterId, setSemesterId] = useState<number | ''>('');

  // Selected student for student-specific queries.
  const [studentId, setStudentId] = useState<number | ''>('');

  // Keyword used for research area or expertise searches.
  const [keyword, setKeyword] = useState<string>('database');

  // Selected department for department-based queries.
  const [departmentId, setDepartmentId] = useState<number | ''>('');

  // Maximum number of rows to return for limited-result queries.
  const [limit, setLimit] = useState<number>(10);

  // Selected program for program-based queries.
  const [programId, setProgramId] = useState<number | ''>('');

  // Counter used to trigger query execution only after the user clicks Run Query.
  const [submitted, setSubmitted] = useState<number>(0);

  // Load student options for student select inputs.
  const studentsLookup = useQuery({
    queryKey: ['studentsLookup'],
    queryFn: getStudentsLookup,
  });

  // Load lecturer options for lecturer select inputs.
  const lecturersLookup = useQuery({
    queryKey: ['lecturersLookup'],
    queryFn: getLecturersLookup,
  });

  // Load course offering options for course offering select inputs.
  const courseOfferingsLookup = useQuery({
    queryKey: ['courseOfferingsLookup'],
    queryFn: getCourseOfferingsLookup,
  });

  // Load semester options for semester select inputs.
  const semestersLookup = useQuery({
    queryKey: ['semestersLookup'],
    queryFn: getSemestersLookup,
  });

  // Load department options for department select inputs.
  const departmentsLookup = useQuery({
    queryKey: ['departmentsLookup'],
    queryFn: getDepartmentsLookup,
  });

  // Load program options for program select inputs.
  const programsLookup = useQuery({
    queryKey: ['programsLookup'],
    queryFn: getProgramsLookup,
  });

  // Run the selected query only after the user has submitted the form.
  const queryResult = useQuery({
    enabled: submitted > 0,
    queryKey: [
      'queryResult',
      queryKey,
      submitted,
      courseOfferingId,
      lecturerId,
      minAverage,
      semesterId,
      studentId,
      keyword,
      departmentId,
      limit,
      programId,
    ],
    queryFn: async () => {
      switch (queryKey) {
        case 'studentsByCourseAndLecturer':
          // Return no results until both required selections are provided.
          if (courseOfferingId === '' || lecturerId === '') return { data: [] };
          return getStudentsByCourseAndLecturer(courseOfferingId, lecturerId);

        case 'finalYearTopStudents':
          // Fetch final-year students above the configured average threshold.
          return getFinalYearTopStudents(minAverage);

        case 'unregisteredCurrentSemester':
          // Return no results until a semester is selected.
          if (semesterId === '') return { data: [] };
          return getUnregisteredCurrentSemester(semesterId);

        case 'studentAdvisorContact':
          // Return no results until a student is selected.
          if (studentId === '') return { data: [] };
          return getStudentAdvisorContact(studentId);

        case 'lecturersByResearchArea':
          // Search lecturers by the provided keyword.
          return getLecturersByResearchArea(keyword);

        case 'coursesByDepartment':
          // Return no results until a department is selected.
          if (departmentId === '') return { data: [] };
          return getCoursesByDepartment(departmentId);

        case 'topProjectSupervisors':
          // Fetch the top supervisors limited by the configured result count.
          return getTopProjectSupervisors(limit);

        case 'studentsByAdvisor':
          // Return no results until a lecturer is selected.
          if (lecturerId === '') return { data: [] };
          return getStudentsByAdvisor(lecturerId);

        case 'staffByDepartment':
          // Return no results until a department is selected.
          if (departmentId === '') return { data: [] };
          return getStaffByDepartment(departmentId);

        case 'programStudentEmployeeSupervisors':
          // Return no results until a program is selected.
          if (programId === '') return { data: [] };
          return getProgramStudentEmployeeSupervisors(programId);
      }
    },
  });

  // Normalize the query response into an array so the table component can render consistently.
  const rows: GenericRow[] = useMemo(() => {
    const raw = queryResult.data?.data;
    if (!raw) return [];
    return Array.isArray(raw) ? raw : [raw];
  }, [queryResult.data]);

  // Increment the submission counter to trigger the query.
  const handleRun = () => {
    setSubmitted((value) => value + 1);
  };

  // Render the form fields required for the currently selected query type.
  const renderFields = () => {
    switch (queryKey) {
      case 'studentsByCourseAndLecturer':
        return (
          <Stack spacing={2}>
            <Typography variant="h6">Students in a Specific Course Taught by a Lecturer</Typography>

            <TextField
              select
              label="Course Offering"
              value={courseOfferingId}
              // Convert the selected value to a number, or reset to an empty value.
              onChange={(e) =>
                setCourseOfferingId(e.target.value === '' ? '' : Number(e.target.value))
              }
            >
              <MenuItem value="">Select a course offering</MenuItem>
              {courseOfferingsLookup.data?.data.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Lecturer"
              value={lecturerId}
              // Convert the selected value to a number, or reset to an empty value.
              onChange={(e) => setLecturerId(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <MenuItem value="">Select a lecturer</MenuItem>
              {lecturersLookup.data?.data.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );

      case 'finalYearTopStudents':
        return (
          <Stack spacing={2}>
            <Typography variant="h6">Final-Year Students Above a Grade Threshold</Typography>
            <TextField
              label="Minimum Average"
              type="number"
              value={minAverage}
              // Update the numeric threshold entered by the user.
              onChange={(e) => setMinAverage(Number(e.target.value))}
            />
          </Stack>
        );

      case 'unregisteredCurrentSemester':
        return (
          <Stack spacing={2}>
            <Typography variant="h6">Students Not Registered in the Current Semester</Typography>

            <TextField
              select
              label="Semester"
              value={semesterId}
              // Convert the selected value to a number, or reset to an empty value.
              onChange={(e) => setSemesterId(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <MenuItem value="">Select a semester</MenuItem>
              {semestersLookup.data?.data.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );

      case 'studentAdvisorContact':
        return (
          <Stack spacing={2}>
            <Typography variant="h6">Advisor Contact for a Student</Typography>

            <TextField
              select
              label="Student"
              value={studentId}
              // Convert the selected value to a number, or reset to an empty value.
              onChange={(e) => setStudentId(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <MenuItem value="">Select a student</MenuItem>
              {studentsLookup.data?.data.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );

      case 'lecturersByResearchArea':
        return (
          <Stack spacing={2}>
            <Typography variant="h6">Lecturers by Expertise or Research Interest</Typography>
            <TextField
              label="Keyword"
              value={keyword}
              // Update the keyword used to search for lecturers.
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Stack>
        );

      case 'coursesByDepartment':
        return (
          <Stack spacing={2}>
            <Typography variant="h6">Courses Taught in a Specific Department</Typography>

            <TextField
              select
              label="Department"
              value={departmentId}
              // Convert the selected value to a number, or reset to an empty value.
              onChange={(e) =>
                setDepartmentId(e.target.value === '' ? '' : Number(e.target.value))
              }
            >
              <MenuItem value="">Select a department</MenuItem>
              {departmentsLookup.data?.data.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );

      case 'topProjectSupervisors':
        return (
          <Stack spacing={2}>
            <Typography variant="h6">
              Lecturers with the Most Supervised Research Projects
            </Typography>
            <TextField
              label="Limit"
              type="number"
              value={limit}
              // Update the maximum number of results to return.
              onChange={(e) => setLimit(Number(e.target.value))}
            />
          </Stack>
        );

      case 'studentsByAdvisor':
        return (
          <Stack spacing={2}>
            <Typography variant="h6">Students Advised by a Specific Lecturer</Typography>

            <TextField
              select
              label="Lecturer"
              value={lecturerId}
              // Convert the selected value to a number, or reset to an empty value.
              onChange={(e) => setLecturerId(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <MenuItem value="">Select a lecturer</MenuItem>
              {lecturersLookup.data?.data.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );

      case 'staffByDepartment':
        return (
          <Stack spacing={2}>
            <Typography variant="h6">Staff Members in a Specific Department</Typography>

            <TextField
              select
              label="Department"
              value={departmentId}
              // Convert the selected value to a number, or reset to an empty value.
              onChange={(e) =>
                setDepartmentId(e.target.value === '' ? '' : Number(e.target.value))
              }
            >
              <MenuItem value="">Select a department</MenuItem>
              {departmentsLookup.data?.data.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );

      case 'programStudentEmployeeSupervisors':
        return (
          <Stack spacing={2}>
            <Typography variant="h6">
              Employees Supervising Student Employees in a Program
            </Typography>

            <TextField
              select
              label="Program"
              value={programId}
              // Convert the selected value to a number, or reset to an empty value.
              onChange={(e) => setProgramId(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <MenuItem value="">Select a program</MenuItem>
              {programsLookup.data?.data.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );
    }
  };

  return (
    // Stack the form controls, action button, and results vertically.
    <Stack spacing={3}>
      {renderFields()}

      <Button variant="contained" onClick={handleRun}>
        Run Query
      </Button>

      {/* Show a loading state while the selected query is running. */}
      {queryResult.isLoading && <LoadingState label="Running query..." />}

      {/* Show an error state if the query request fails. */}
      {queryResult.isError && <ErrorState message="Could not run query." />}

      {/* Show an empty state when the query succeeds but returns no rows. */}
      {queryResult.isSuccess && rows.length === 0 && (
        <EmptyState message="No results found for this query." />
      )}

      {/* Show the results table and export buttons when rows are returned. */}
      {queryResult.isSuccess && rows.length > 0 && (
        <>
          <ResultsTable rows={rows} />
          <DownloadButtons title={queryKey} rows={rows} />
        </>
      )}
    </Stack>
  );
}