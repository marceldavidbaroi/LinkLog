// src/utils/report-export.ts
import { ExportFormat } from 'src/reports/reports.enum';
import { Reports } from 'src/reports/reports.entity';
import PDFDocument from 'pdfkit';
import { stringify } from 'csv-stringify/sync';

export class ReportExport {
  /**
   * Export report data as PDF or CSV
   */
  static exportReport(
    report: Reports,
    format: ExportFormat,
  ): Buffer | Promise<Buffer> {
    switch (format) {
      case ExportFormat.PDF:
        return this.toPDF(report);
      case ExportFormat.CSV:
        return this.toCSV(report);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Convert report to PDF
   */
  private static toPDF(report: Reports): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err: Error) => reject(err));

        // Title
        doc.fontSize(18).text(`Financial Report (${report.reportType})`, {
          align: 'center',
        });
        doc.moveDown();

        // Meta Info
        doc
          .fontSize(12)
          .text(
            `Period: ${report.periodStart.toString()} → ${report.periodEnd.toString()}`,
          );
        doc.text(`Generated: ${report.createdAt.toDateString()}`);
        doc.moveDown();

        // Report Data
        doc.fontSize(14).text('Report Data:');
        doc.moveDown();
        doc
          .fontSize(10)
          .text(JSON.stringify(report.data ?? {}, null, 2), { width: 400 });

        doc.end();
      } catch (err) {
        reject(err instanceof Error ? err : new Error('PDF generation failed'));
      }
    });
  }

  /**
   * Convert report to CSV
   */
  private static toCSV(report: Reports): Buffer {
    const rows = Object.entries(report.data ?? {}).map(([key, value]) => ({
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value),
    }));

    const csvString: string = stringify(rows, {
      header: true,
      columns: ['key', 'value'],
    });
    return Buffer.from(csvString);
  }
}
