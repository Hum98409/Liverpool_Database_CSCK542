import { Box, Container, Grid } from '@mui/material';
import { Outlet } from 'react-router-dom';
import NavMenu from './NavMenu';
import TopBar from './TopBar';
export default function AppShell() {
    return (
        <Box>
            <TopBar />
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 3, lg: 2 }}>
                        <NavMenu />
                    </Grid>
                    <Grid size={{ xs: 12, md: 9, lg: 10 }}>
                        <Outlet />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}