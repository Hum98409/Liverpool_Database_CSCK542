import { useQuery } from '@tanstack/react-query';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { getDepartmentsLookup } from '../../api/lookups';
import { getLecturerPublicationsReport } from '../../api/reports';
import DownloadButtons from '../../components/common/DownloadButtons';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import PageHeader from '../../components/common/PageHeader';
import ResultsTable from '../../components/common/ResultsTable';

export default function ReportsPage() {
  const [year, setYear] = useState<number>(2025);
  const [departmentId, setDepartmentId] = useState<number | ''>('');
  const [submittedYear, setSubmittedYear] = useState<number>(2025);
  const [submittedDepartmentId, setSubmittedDepartmentId] = useState<number | undefined>(undefined);

  const departmentsLookup = useQuery({ queryKey: ['departmentsLookup'], queryFn: getDepartmentsLookup });
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['lecturerPublicationsReport', submittedYear, submittedDepartmentId],
    queryFn: () => getLecturerPublicationsReport(submittedYear, submittedDepartmentId),
  });

  const rows = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Reports" subtitle="Display and download report-style views of the academic data." />
      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <Typography variant="h6">Lecturer Publications Report</Typography>
        <TextField label="Year" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        <TextField select label="Department Optional" value={departmentId} onChange={(e) => setDepartmentId(e.target.value === '' ? '' : Number(e.target.value))}>
          <MenuItem value="">All Departments</MenuItem>
          {departmentsLookup.data?.data.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          onClick={() => {
            setSubmittedYear(year);
            setSubmittedDepartmentId(departmentId === '' ? undefined : Number(departmentId));
          }}
        >
          Generate Report
        </Button>
      </Stack>
      {isLoading && <LoadingState label="Generating report..." />}
      {isError && <ErrorState message="Could not generate the report." />}
      {isSuccess && rows.length === 0 && <EmptyState message="No report rows found." />}
      {isSuccess && rows.length > 0 && (
        <>
          <ResultsTable rows={rows} />
          <DownloadButtons title="lecturer-publications-report" rows={rows} />
        </>
      )}
    </div>
  );
}