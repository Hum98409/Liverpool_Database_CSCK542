import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { GenericRow } from '../types/queries';

/**
 * Generates a PDF report from tabular row data and downloads it.
 *
 * Adds the report title at the top of the page, optionally renders a table
 * when rows are available, and saves the document using the title as the filename.
 */
export function downloadPdfReport(title: string, rows: GenericRow[]) {
    // Create a new PDF document instance.
    const doc = new jsPDF();

    // Add the report title near the top-left of the first page.
    doc.text(title, 14, 16);

    // Render a table only when there is data to display.
    if (rows.length > 0) {
        autoTable(doc, {
            // Use the first row's keys as the table header labels.
            head: [Object.keys(rows[0])],

            // Convert each row's values to strings so they can be rendered in the PDF table.
            body: rows.map((row) =>
                Object.values(row).map((value) => String(value ?? ''))
            ),

            // Position the table below the title text.
            startY: 24,
        });
    }

    // Save the PDF using the report title as the filename.
    doc.save(`${title}.pdf`);
}