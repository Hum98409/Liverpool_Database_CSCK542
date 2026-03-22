import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { GenericRow } from '../../types/queries';

/**
 * Renders tabular query results using the keys from the first row as columns.
 *
 * Returns nothing when there are no rows to display.
 */
export default function ResultsTable({ rows }: { rows: GenericRow[] }) {
  // Do not render the table when no result rows are available.
  if (!rows.length) return null;

  // Derive the table columns from the first row's property names.
  const columns = Object.keys(rows[0]);

  return (
    // Wrap the table in a paper container and add top margin for spacing.
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      {/* Use a compact table layout for dense result sets. */}
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              // Render one header cell for each derived column.
              <TableCell key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            // Render one table row for each result object.
            <TableRow key={index}>
              {columns.map((column) => (
                // Render each cell value as a string, defaulting empty values to an empty string.
                <TableCell key={column}>{String(row[column] ?? '')}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}