import { AppBar, Box, Chip, Toolbar, Typography } from '@mui/material';

export default function TopBar() {
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          University Database Query Portal
        </Typography>
        <Box>
          <Chip
            label={useMocks ? 'Mock API Mode' : 'Live API Mode'}
            color={useMocks ? 'warning' : 'success'}
            variant="filled"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}