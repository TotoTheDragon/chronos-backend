import { Session } from "@prisma/client";

export abstract class AbstractExporter {
    readonly fileType: string;
    readonly contentType: string;
    
    abstract export(data: Session[]): any;
}
