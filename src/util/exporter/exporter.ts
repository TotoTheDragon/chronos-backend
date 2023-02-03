import { XLSXExporter } from "@/util/exporter/PdfExporter";
import Session from "@/schemas/session";
import { objectEnumValues } from "@prisma/client/runtime";
import { AbstractExporter } from "./AbstractExporter";

export class Exporter {

    exporters = new Map<string, AbstractExporter>([
        ['XLSX', new XLSXExporter()],
    ])

    // add calculated attributes here
    attrCalculators = new Map<string, Function>([
        ['date', this.calcDate],
        ['hours', this.calcHours],
    ]);



    export(data: Array<typeof Session>, fileType: string, options = ['date', 'start_time', 'end_time', 'hours', 'description']): any {

        // check if file type is supported
        if (!this.exporters.has(fileType)) {
            return null;
        }

        // filter out all invalid options
        // such as options that are not attributes of session and also have no method to calculate them
        options = options.filter(option => {
            return (Object.keys(Session.properties).includes(option) ||
                this.attrCalculators.has(option))
        })

        const filteredSessions = []

        data.forEach(session => {

            // create new session object with each attribute in options[] by taking the attribute from the session object or calculating it
            const filteredSession = {}
            options.forEach(option => {
                if (this.attrCalculators.has(option)) {
                    filteredSession[option] = this.attrCalculators.get(option).apply(session);
                } else {
                    filteredSession[option] = session[option];
                }
            })
            filteredSessions.push(filteredSession);
        })

        return this.exporters.get(fileType).export(filteredSessions);
    }

    // ATTRIBUTE CALCULATORS
    calcDate(session) {
        return null;
    }

    calcHours(session) {
        return null;
    }
}
