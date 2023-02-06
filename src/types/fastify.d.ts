
declare global {
    import { APIUser } from './User';
    import { Snowflake } from '@/util/snowflake';
    import { PrismaClient } from '@prisma/client';
    import { ExporterManager } from '@/exporter/ExporterManager';

    module 'fastify' {
        interface FastifyInstance {
            prisma: PrismaClient;
            snowflake: Snowflake;
            exporter: ExporterManager;
        }
        interface FastifyRequest {
            user: APIUser;
        }
    }
}
