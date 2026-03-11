import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DownloadButtons from './DownloadButtons';
import { renderWithProviders } from '../../test/renderWithProviders';
import * as csvModule from '../../utils/csv';
import * as pdfModule from '../../utils/pdf';

describe('DownloadButtons', () => {
  test('calls CSV export', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(csvModule, 'downloadCsv').mockImplementation(() => {});

    renderWithProviders(<DownloadButtons title="report" rows={[{ name: 'Alice' }]} />);
    await user.click(screen.getByRole('button', { name: /Export CSV/i }));

    expect(spy).toHaveBeenCalled();
  });

  test('calls PDF export', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(pdfModule, 'downloadPdfReport').mockImplementation(() => {});

    renderWithProviders(<DownloadButtons title="report" rows={[{ name: 'Alice' }]} />);
    await user.click(screen.getByRole('button', { name: /Export PDF/i }));

    expect(spy).toHaveBeenCalled();
  });
});