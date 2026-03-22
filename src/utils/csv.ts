import type { GenericRow } from '../types/queries';

/**
 * Converts an array of rows into CSV format and triggers a file download.
 *
 * Does nothing when the rows array is empty.
 */
export function downloadCsv(filename: string, rows: GenericRow[]) {
    // Exit early if there is no data to export.
    if (!rows.length) return;

    // Use the first row's keys as the CSV column headers.
    const headers = Object.keys(rows[0]);

    // Build the CSV content by combining the header row and data rows.
    const csv = [
        headers.join(','),
        ...rows.map((row) =>
            // Convert each cell value to a JSON string to safely handle commas, quotes, and nullish values.
            headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
        ),
    ].join('\n');

    // Create a Blob containing the CSV text with UTF-8 encoding.
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Generate a temporary object URL for the Blob.
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the browser download.
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);

    // Add the link to the document, click it, then remove it.
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the temporary object URL to avoid memory leaks.
    URL.revokeObjectURL(url);
}