import { Box, Typography } from '@mui/material';

/**
 * Displays a page title with an optional subtitle.
 *
 * Adds bottom spacing below the header block to separate it from page content.
 */
export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    // Wrap the header content and apply bottom margin for layout spacing.
    <Box sx={{ mb: 3 }}>
      {/* Render the main page title using a large heading style. */}
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      {/* Render the subtitle only when one is provided. */}
      {subtitle ? <Typography color="text.secondary">{subtitle}</Typography> : null}
    </Box>
  );
}