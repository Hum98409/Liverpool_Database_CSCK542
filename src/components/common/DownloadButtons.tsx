import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Button, Stack } from '@mui/material';
import type { GenericRow } from '../../types/queries';
import { downloadCsv } from '../../utils/csv';
import { downloadPdfReport } from '../../utils/pdf';

/**
 * Renders action buttons for exporting tabular data in CSV or PDF format.
 */
export default function DownloadButtons({ title, rows }: { title: string; rows: GenericRow[] }) {
  return (
    // Arrange the export buttons horizontally with spacing and top margin.
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      <Button
        // Use an outlined style for the CSV export action.
        variant="outlined"
        // Show a download icon before the button label.
        startIcon={<DownloadIcon />}
        // Download the current rows as a CSV file using the title as the filename.
        onClick={() => downloadCsv(`${title}.csv`, rows)}
      >
        Export CSV
      </Button>

      <Button
        // Use a contained style to emphasize the PDF export action.
        variant="contained"
        // Show a PDF icon before the button label.
        startIcon={<PictureAsPdfIcon />}
        // Generate and download a PDF report using the provided title and rows.
        onClick={() => downloadPdfReport(title, rows)}
      >
        Export PDF
      </Button>
    </Stack>
  );
}