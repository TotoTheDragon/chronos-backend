import Session from "@/schemas/session";

export abstract class AbstractExporter {
    abstract export(data: Array<object>): any;
}
