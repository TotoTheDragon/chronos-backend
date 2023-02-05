import { AbstractExporter } from "@/exporter/AbstractExporter";
const XLSX = require('xlsx')

export class XLSXExporter extends AbstractExporter {
    export(sessions) {
        const JSONSessions = JSON.stringify(sessions);

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(sessions);
        XLSX.utils.book_append_sheet(wb, ws, "session Export");
        const wopts = { bookType: 'xlsx', bookSST: false, type: 'buffer' }
        const wBuffer = XLSX.write(wb, wopts)
        console.log(wBuffer)
        return {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=' + 'calogs.xlsx',
            },
            file: wBuffer,

        }
    }
}
