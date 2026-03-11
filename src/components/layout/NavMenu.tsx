import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const items = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Queries', path: '/queries', icon: <SearchIcon /> },
  { label: 'Reports', path: '/reports', icon: <DescriptionIcon /> },
];

export default function NavMenu() {
  const location = useLocation();

  return (
    <Paper sx={{ p: 1 }}>
      <List>
        {items.map((item) => (
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
      </List>
    </Paper>
  );
}