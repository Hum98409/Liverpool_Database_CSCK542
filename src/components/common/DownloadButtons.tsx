import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Button, Stack } from '@mui/material';
import type { GenericRow } from '../../types/queries';
import { downloadCsv } from '../../utils/csv';
import { downloadPdfReport } from '../../utils/pdf';
export default function DownloadButtons({ title, rows }: { title: string; rows:
GenericRow[] }) {
return (
<Stack direction="row" spacing={2} sx={{ mt: 2 }}>
<Button
variant="outlined"
startIcon={<DownloadIcon />}
onClick={() => downloadCsv(`${title}.csv`, rows)}
>
Export CSV
</Button>
<Button
variant="contained"
startIcon={<PictureAsPdfIcon />}
onClick={() => downloadPdfReport(title, rows)}
>
Export PDF
</Button>
</Stack>
);
}