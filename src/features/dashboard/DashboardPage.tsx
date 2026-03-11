import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { getDashboardSummary } from '../../api/dashboard';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import PageHeader from '../../components/common/PageHeader';
export default function DashboardPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['dashboardSummary'],
        queryFn: getDashboardSummary,
    });
    if (isLoading) return <LoadingState label="Loading dashboard..." />;
    if (isError || !data) return <ErrorState message="Could not load dashboard
summary." />;
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
                subtitle="Summary view of the academic database using mock API
responses."
            />
            <Grid container spacing={2}>
                {cards.map((card) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">{card.label}</Typography>
                                <Typography variant="h4">{card.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}