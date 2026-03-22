import { Box, Container, Grid } from '@mui/material';
import { Outlet } from 'react-router-dom';
import NavMenu from './NavMenu';
import TopBar from './TopBar';

/**
 * Provides the main authenticated application layout.
 *
 * Renders the top navigation bar, a side navigation menu,
 * and an outlet for the currently matched child route.
 */
export default function AppShell() {
  return (
    // Wrap the full application shell layout.
    <Box>
      {/* Render the top bar at the top of the page. */}
      <TopBar />

      {/* Constrain the main content width and add vertical padding. */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Create a responsive grid for the sidebar and main content area. */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3, lg: 2 }}>
            {/* Render the side navigation menu. */}
            <NavMenu />
          </Grid>

          <Grid size={{ xs: 12, md: 9, lg: 10 }}>
            {/* Render the currently matched nested route content. */}
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}