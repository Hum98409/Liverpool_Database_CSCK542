import { Alert } from '@mui/material';

export default function EmptyState({ message = 'No results found.' }: { message?: string }) {
  return <Alert severity="info">{message}</Alert>;
}