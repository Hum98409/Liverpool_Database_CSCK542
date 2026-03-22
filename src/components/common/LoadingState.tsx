import { CircularProgress, Stack, Typography } from '@mui/material';

/**
 * Displays a simple inline loading indicator with an optional label.
 *
 * Uses a spinner and text arranged horizontally to communicate loading state.
 */
export default function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    // Arrange the spinner and label side by side with spacing and vertical padding.
    <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 3 }}>
      {/* Show a compact circular spinner to indicate background activity. */}
      <CircularProgress size={24} />

      {/* Display the provided loading message, or the default label when none is passed. */}
      <Typography>{label}</Typography>
    </Stack>
  );
}