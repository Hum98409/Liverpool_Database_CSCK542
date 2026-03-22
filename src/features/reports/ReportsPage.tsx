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

/**
 * Renders the reports page for generating and exporting lecturer publication data.
 *
 * Allows the user to choose a year and an optional department filter,
 * then displays the resulting report in a table with export options.
 */
export default function ReportsPage() {
  // Track the currently selected report year in the form.
  const [year, setYear] = useState<number>(2025);

  // Track the currently selected department filter in the form.
  const [departmentId, setDepartmentId] = useState<number | ''>('');

  // Store the submitted year so the report query runs only with confirmed inputs.
  const [submittedYear, setSubmittedYear] = useState<number>(2025);

  // Store the submitted department filter for the executed report query.
  const [submittedDepartmentId, setSubmittedDepartmentId] = useState<number | undefined>(undefined);

  // Load department options for the optional department filter dropdown.
  const departmentsLookup = useQuery({
    queryKey: ['departmentsLookup'],
    queryFn: getDepartmentsLookup,
  });

  // Fetch the lecturer publications report using the most recently submitted filters.
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['lecturerPublicationsReport', submittedYear, submittedDepartmentId],
    queryFn: () => getLecturerPublicationsReport(submittedYear, submittedDepartmentId),
  });

  // Extract the report rows, defaulting to an empty array when no data is available.
  const rows = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Display and download report-style views of the academic data."
      />

      {/* Render the report filter form. */}
      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <Typography variant="h6">Lecturer Publications Report</Typography>

        <TextField
          label="Year"
          type="number"
          value={year}
          // Update the selected report year as the user types.
          onChange={(e) => setYear(Number(e.target.value))}
        />

        <TextField
          select
          label="Department Optional"
          value={departmentId}
          // Convert the selected department to a number, or reset to empty for all departments.
          onChange={(e) => setDepartmentId(e.target.value === '' ? '' : Number(e.target.value))}
        >
          <MenuItem value="">All Departments</MenuItem>
          {departmentsLookup.data?.data.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          onClick={() => {
            // Commit the current form values so the report query uses them.
            setSubmittedYear(year);
            setSubmittedDepartmentId(departmentId === '' ? undefined : Number(departmentId));
          }}
        >
          Generate Report
        </Button>
      </Stack>

      {/* Show a loading indicator while the report is being generated. */}
      {isLoading && <LoadingState label="Generating report..." />}

      {/* Show an error state if the report request fails. */}
      {isError && <ErrorState message="Could not generate the report." />}

      {/* Show an empty state when the report succeeds but returns no rows. */}
      {isSuccess && rows.length === 0 && <EmptyState message="No report rows found." />}

      {/* Show the report table and export actions when rows are available. */}
      {isSuccess && rows.length > 0 && (
        <>
          <ResultsTable rows={rows} />
          <DownloadButtons title="lecturer-publications-report" rows={rows} />
        </>
      )}
    </div>
  );
}