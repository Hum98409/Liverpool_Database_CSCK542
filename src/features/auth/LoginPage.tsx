import { useMutation } from '@tanstack/react-query';
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth';

/**
 * Renders the login screen for the database management system.
 *
 * Allows the user to choose a role, enter a password, and submit
 * a login request. On success, the authenticated user is stored
 * in context and redirected to the dashboard.
 */
export default function LoginPage() {
  // Access navigation so the user can be redirected after a successful login.
  const navigate = useNavigate();

  // Get the auth context action used to store the logged-in user.
  const { loginUser } = useAuth();

  // Track the selected login role in local component state.
  const [role, setRole] = useState<UserRole>('teacher');

  // Track the password entered by the user.
  const [password, setPassword] = useState('');

  // Define the login mutation for submitting credentials to the API.
  const mutation = useMutation({
    // Call the login API with the current role and password values.
    mutationFn: () => login(role, password),

    // Save the returned user in auth context and redirect to the home page.
    onSuccess: (data) => {
      loginUser(data.user);
      navigate('/', { replace: true });
    },
  });

  return (
    <Box
      sx={{
        // Fill the viewport height so the login card can be centered vertically.
        minHeight: '100vh',
        // Use CSS grid to center the login card.
        display: 'grid',
        placeItems: 'center',
        // Add horizontal padding on small screens.
        px: 2,
      }}
    >
      {/* Constrain the login form width inside a card. */}
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent>
          {/* Stack form elements vertically with consistent spacing. */}
          <Stack spacing={3}>
            <Typography variant="h4" textAlign="center">
              Database Management System
            </Typography>

            <TextField
              // Render this field as a dropdown select.
              select
              label="Role"
              value={role}
              // Update the selected role when the user chooses a different option.
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="non_academic_staff">Non Academic Staff</MenuItem>
            </TextField>

            <TextField
              label="Password"
              // Mask the entered password characters.
              type="password"
              value={password}
              // Update the password state as the user types.
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              // Trigger the login mutation when the button is clicked.
              onClick={() => mutation.mutate()}
              // Prevent repeated submissions while the request is in progress.
              disabled={mutation.isPending}
            >
              Login
            </Button>

            {/* Show an error message when the login request fails. */}
            {mutation.isError ? (
              <Alert severity="error">Invalid role or password.</Alert>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}