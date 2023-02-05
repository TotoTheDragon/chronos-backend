import { AbstractExporter } from '@/exporter/AbstractExporter';
import { Session } from '@prisma/client';
import XLSX from 'xlsx';

export class ExcelExporter extends AbstractExporter {
    fileType = 'xlsx';
    contentType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    export(sessions: Session[]): Buffer {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(sessions);
        XLSX.utils.book_append_sheet(wb, ws, 'session Export');
        const wopts = {
            bookType: 'xlsx' as const,
            bookSST: false,
            type: 'buffer' as const,
        };
        const wBuffer = XLSX.write(wb, wopts);
        return wBuffer;
    }
}
