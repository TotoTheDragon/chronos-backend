import { ExcelExporter } from '@/exporter/ExcelExporter';
import { Session } from '@prisma/client';
import { AbstractExporter } from './AbstractExporter';

const ALLOWED_OPTIONS = {
    date: true,
    start_time: true,
    end_time: true,
    hours: true,
    description: true,
};

export class ExporterManager {
    exporters: Map<string, AbstractExporter>;
    attributeConsumers: Map<string, (session: Session) => unknown>;

    constructor() {
        // Initialize maps
        this.exporters = new Map();
        this.attributeConsumers = new Map();

        // Load exporters
        this.loadExporter(ExcelExporter);

        // Load attribute consumers
        this.attributeConsumers.set('date', this.calcDate);
        this.attributeConsumers.set('hours', this.calcHours);
    }

    loadExporter(exporterClass: new () => AbstractExporter): void {
        const exporter = new exporterClass();
        this.exporters.set(exporter.fileType, exporter);
    }

    getExporter(fileType: string): AbstractExporter | undefined {
        return this.exporters.get(fileType);
    }

    filterSessionData(
        data: Session[],
        options = ['date', 'start_time', 'end_time', 'hours', 'description'],
    ): Session[] {
        options = options.filter((option) => ALLOWED_OPTIONS[option]);

        const filteredSessions = [];
        data.forEach((session) => {
            // create new session object with each attribute in options[] by taking the attribute from the session object or calculating it
            const filteredSession = {};
            options.forEach((option) => {
                if (this.attributeConsumers.has(option)) {
                    filteredSession[option] = this.attributeConsumers
                        .get(option)
                        .call(this, session);
                } else {
                    filteredSession[option] = session[option];
                }
            });
            filteredSessions.push(filteredSession);
        });

        return filteredSessions;
    }

    // ATTRIBUTE CALCULATORS
    calcDate(_session: Session) {
        return null;
    }

    calcHours(session: Session) {
        if (session.end_time === null) {
            return 0;
        }
        const timeSpent =
            session.end_time.getTime() - session.start_time.getTime();
        return Math.floor(timeSpent / (1000 * 60 * 60));
    }
}
