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
  label: string;
  path: string;
  icon: JSX.Element;
  roles: UserRole[];
};

export default function NavMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

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

  const visibleItems = user
    ? items.filter((item) => item.roles.includes(user.role))
    : [];

  return (
    <Paper sx={{ p: 1 }}>
      <List>
        {visibleItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        <ListItemButton
          onClick={() => {
            logoutUser();
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