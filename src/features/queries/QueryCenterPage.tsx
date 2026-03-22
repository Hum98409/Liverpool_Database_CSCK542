import { useState } from 'react';
import { Box, Card, CardContent, List, ListItemButton, ListItemText, Paper } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import QueryFormRenderer from './QueryFormRenderer';
import { queryDefinitions, type QueryKey } from './queryDefinitions';

/**
 * Renders the main query center interface for selecting and running database queries.
 *
 * Displays a list of available queries on the left and the selected query's
 * form on the right.
 */
export default function QueryCenterPage() {
  // Track which query is currently selected in the query center.
  const [selectedQuery, setSelectedQuery] = useState<QueryKey>('studentsByCourseAndLecturer');

  return (
    <div>
      <PageHeader
        title="Query Center"
        subtitle="Run academic database queries through a guided user interface."
      />

      <Box
        sx={{
          // Use a responsive two-column layout on medium screens and above.
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '320px 1fr' },
          // Add spacing between the query list and form panel.
          gap: 2,
          // Align items to the top of the layout.
          alignItems: 'start',
        }}
      >
        <Paper
          data-testid="query-list-panel"
          sx={{
            // Add inner spacing around the query list.
            p: 1,
            // Limit panel height on larger screens so it can scroll independently.
            height: { xs: 'auto', md: '70vh' },
            // Enable vertical scrolling when the query list exceeds the panel height.
            overflowY: { xs: 'visible', md: 'auto' },
            // Keep the list panel visible while scrolling on larger screens.
            position: 'sticky',
            top: 16,
          }}
        >
          <List>
            {queryDefinitions.map((query) => (
              <ListItemButton
                key={query.key}
                // Highlight the currently selected query.
                selected={selectedQuery === query.key}
                // Update the selected query when a list item is clicked.
                onClick={() => setSelectedQuery(query.key)}
                // Align text to the top to better fit multi-line descriptions.
                sx={{ alignItems: 'flex-start' }}
              >
                <ListItemText primary={query.title} secondary={query.description} />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        <Card>
          <CardContent>
            {/* Render the form for the currently selected query definition. */}
            <QueryFormRenderer queryKey={selectedQuery} />
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}