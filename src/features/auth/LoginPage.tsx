import { useMutation } from '@tanstack/react-query';
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [role, setRole] = useState<UserRole>('teacher');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () => login(role, password),
    onSuccess: (data) => {
      loginUser(data.user);
      navigate('/', { replace: true });
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h4" textAlign="center">
              Database Management System
            </Typography>

            <TextField
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="non_academic_staff">Non Academic Staff</MenuItem>
            </TextField>

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              Login
            </Button>

            {mutation.isError ? (
              <Alert severity="error">Invalid role or password.</Alert>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}