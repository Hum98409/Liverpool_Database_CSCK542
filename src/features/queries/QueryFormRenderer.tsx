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

export default function QueryFormRenderer({ queryKey }: { queryKey: QueryKey }) {
  const [courseOfferingId, setCourseOfferingId] = useState<number | ''>('');
  const [lecturerId, setLecturerId] = useState<number | ''>('');
  const [minAverage, setMinAverage] = useState<number>(70);
  const [semesterId, setSemesterId] = useState<number | ''>('');
  const [studentId, setStudentId] = useState<number | ''>('');
  const [keyword, setKeyword] = useState<string>('database');
  const [departmentId, setDepartmentId] = useState<number | ''>('');
  const [limit, setLimit] = useState<number>(10);
  const [programId, setProgramId] = useState<number | ''>('');
  const [submitted, setSubmitted] = useState<number>(0);

  const studentsLookup = useQuery({
    queryKey: ['studentsLookup'],
    queryFn: getStudentsLookup,
  });

  const lecturersLookup = useQuery({
    queryKey: ['lecturersLookup'],
    queryFn: getLecturersLookup,
  });

  const courseOfferingsLookup = useQuery({
    queryKey: ['courseOfferingsLookup'],
    queryFn: getCourseOfferingsLookup,
  });

  const semestersLookup = useQuery({
    queryKey: ['semestersLookup'],
    queryFn: getSemestersLookup,
  });

  const departmentsLookup = useQuery({
    queryKey: ['departmentsLookup'],
    queryFn: getDepartmentsLookup,
  });

  const programsLookup = useQuery({
    queryKey: ['programsLookup'],
    queryFn: getProgramsLookup,
  });

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
          if (courseOfferingId === '' || lecturerId === '') return { data: [] };
          return getStudentsByCourseAndLecturer(courseOfferingId, lecturerId);

        case 'finalYearTopStudents':
          return getFinalYearTopStudents(minAverage);

        case 'unregisteredCurrentSemester':
          if (semesterId === '') return { data: [] };
          return getUnregisteredCurrentSemester(semesterId);

        case 'studentAdvisorContact':
          if (studentId === '') return { data: [] };
          return getStudentAdvisorContact(studentId);

        case 'lecturersByResearchArea':
          return getLecturersByResearchArea(keyword);

        case 'coursesByDepartment':
          if (departmentId === '') return { data: [] };
          return getCoursesByDepartment(departmentId);

        case 'topProjectSupervisors':
          return getTopProjectSupervisors(limit);

        case 'studentsByAdvisor':
          if (lecturerId === '') return { data: [] };
          return getStudentsByAdvisor(lecturerId);

        case 'staffByDepartment':
          if (departmentId === '') return { data: [] };
          return getStaffByDepartment(departmentId);

        case 'programStudentEmployeeSupervisors':
          if (programId === '') return { data: [] };
          return getProgramStudentEmployeeSupervisors(programId);
      }
    },
  });

  const rows: GenericRow[] = useMemo(() => {
    const raw = queryResult.data?.data;
    if (!raw) return [];
    return Array.isArray(raw) ? raw : [raw];
  }, [queryResult.data]);

  const handleRun = () => {
    setSubmitted((value) => value + 1);
  };

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
            <Typography variant="h6">Lecturers by Research Area</Typography>
            <TextField
              label="Keyword"
              value={keyword}
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
    <Stack spacing={3}>
      {renderFields()}

      <Button variant="contained" onClick={handleRun}>
        Run Query
      </Button>

      {queryResult.isLoading && <LoadingState label="Running query..." />}
      {queryResult.isError && <ErrorState message="Could not run query." />}
      {queryResult.isSuccess && rows.length === 0 && (
        <EmptyState message="No results found for this query." />
      )}
      {queryResult.isSuccess && rows.length > 0 && (
        <>
          <ResultsTable rows={rows} />
          <DownloadButtons title={queryKey} rows={rows} />
        </>
      )}
    </Stack>
  );
}