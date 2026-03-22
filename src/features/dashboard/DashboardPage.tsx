import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { getDashboardSummary } from '../../api/dashboard';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import PageHeader from '../../components/common/PageHeader';

/**
 * Displays a dashboard summary of key academic database metrics.
 *
 * Fetches summary data from the API and renders loading, error,
 * or summary cards depending on the query state.
 */
export default function DashboardPage() {
  // Fetch dashboard summary data and track loading and error states.
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: getDashboardSummary,
  });

  // Show a loading indicator while the dashboard data is being fetched.
  if (isLoading) return <LoadingState label="Loading dashboard..." />;

  // Show an error state if the request fails or no data is returned.
  if (isError || !data) return <ErrorState message="Could not load dashboard summary." />;

  // Prepare the summary metrics to render as dashboard cards.
  const cards = [
    { label: 'Total Students', value: data.totalStudents },
    { label: 'Total Lecturers', value: data.totalLecturers },
    { label: 'Total Courses', value: data.totalCourses },
    { label: 'Total Departments', value: data.totalDepartments },
    { label: 'Current Semester', value: data.currentSemester },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Summary view of the academic database using mock API responses."
      />

      {/* Render the summary metrics in a responsive card grid. */}
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card>
              <CardContent>
                {/* Display the metric label in secondary text style. */}
                <Typography color="text.secondary">{card.label}</Typography>

                {/* Display the metric value prominently. */}
                <Typography variant="h4">{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}