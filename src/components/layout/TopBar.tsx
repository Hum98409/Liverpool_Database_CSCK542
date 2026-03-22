import { AppBar, Box, Chip, Toolbar, Typography } from '@mui/material';

/**
 * Renders the application's top navigation bar.
 *
 * Displays the portal title and an environment status chip
 * showing whether the app is using mock or live API mode.
 */
export default function TopBar() {
  // Read the environment flag to determine whether mock APIs are enabled.
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

  return (
    // Render the top application bar.
    <AppBar position="static">
      <Toolbar>
        {/* Display the application title and allow it to take up remaining horizontal space. */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          University Database Query Portal
        </Typography>

        <Box>
          <Chip
            // Show the current API mode in the status chip.
            label={useMocks ? 'Mock API Mode' : 'Live API Mode'}
            // Use different chip colors to visually distinguish mock and live modes.
            color={useMocks ? 'warning' : 'success'}
            variant="filled"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}