import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { GenericRow } from '../types/queries';
export function downloadPdfReport(title: string, rows: GenericRow[]) {
    const doc = new jsPDF();
    doc.text(title, 14, 16);
    if (rows.length > 0) {
        autoTable(doc, {
            head: [Object.keys(rows[0])],
            body: rows.map((row) => Object.values(row).map((value) => String(value ??
                ''))),
            startY: 24,
        });
    }
    doc.save(`${title}.pdf`);
}