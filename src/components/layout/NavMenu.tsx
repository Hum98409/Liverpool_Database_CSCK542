import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth';
import type { JSX } from 'react';

type NavItem = {
  // Text shown for the navigation item.
  label: string;

  // Route path the item links to.
  path: string;

  // Icon displayed alongside the label.
  icon: JSX.Element;

  // User roles allowed to see this navigation item.
  roles: UserRole[];
};

/**
 * Renders the side navigation menu based on the current user's role.
 *
 * Shows only the routes the authenticated user is allowed to access
 * and includes a logout action at the bottom of the menu.
 */
export default function NavMenu() {
  // Access the current route to highlight the selected menu item.
  const location = useLocation();

  // Get the navigate function for programmatic redirects.
  const navigate = useNavigate();

  // Read the current user and logout action from auth context.
  const { user, logoutUser } = useAuth();

  // Define all possible navigation items and the roles allowed to view them.
  const items: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <DashboardIcon />,
      roles: ['teacher', 'student', 'non_academic_staff'],
    },
    {
      label: 'Queries',
      path: '/queries',
      icon: <SearchIcon />,
      roles: ['teacher'],
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: <DescriptionIcon />,
      roles: ['teacher', 'non_academic_staff'],
    },
  ];

  // Filter the menu so only items allowed for the current user's role are shown.
  const visibleItems = user
    ? items.filter((item) => item.roles.includes(user.role))
    : [];

  return (
    // Wrap the navigation list in a paper surface.
    <Paper sx={{ p: 1 }}>
      <List>
        {visibleItems.map((item) => (
          <ListItemButton
            key={item.path}
            // Render the menu item as a router link.
            component={Link}
            to={item.path}
            // Highlight the item when its path matches the current location.
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        <ListItemButton
          onClick={() => {
            // Clear the current authentication state.
            logoutUser();

            // Redirect the user to the login page after logging out.
            navigate('/login', { replace: true });
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Paper>
  );
}