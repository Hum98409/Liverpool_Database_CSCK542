import { CircularProgress, Stack, Typography } from '@mui/material';

export default function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 3 }}>
      <CircularProgress size={24} />
      <Typography>{label}</Typography>
    </Stack>
  );
}