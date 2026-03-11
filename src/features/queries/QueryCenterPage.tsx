import { useState } from 'react';
import { Box, Card, CardContent, List, ListItemButton, ListItemText, Paper } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import QueryFormRenderer from './QueryFormRenderer';
import { queryDefinitions, type QueryKey } from './queryDefinitions';


export default function QueryCenterPage() {
  const [selectedQuery, setSelectedQuery] = useState<QueryKey>('studentsByCourseAndLecturer');

  return (
    <div>
      <PageHeader
        title="Query Center"
        subtitle="Run academic database queries through a guided user interface."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '320px 1fr' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <Paper
          data-testid="query-list-panel"
          sx={{
            p: 1,
            height: { xs: 'auto', md: '70vh' },
            overflowY: { xs: 'visible', md: 'auto' },
            position: 'sticky',
            top: 16,
          }}
        >
          <List>
            {queryDefinitions.map((query) => (
              <ListItemButton
                key={query.key}
                selected={selectedQuery === query.key}
                onClick={() => setSelectedQuery(query.key)}
                sx={{ alignItems: 'flex-start' }}
              >
                <ListItemText primary={query.title} secondary={query.description} />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        <Card>
          <CardContent>
            <QueryFormRenderer queryKey={selectedQuery} />
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}