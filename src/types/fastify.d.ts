declare global {
    import { Snowflake } from '@/util/snowflake';
    import { PrismaClient, User } from '@prisma/client';
    import { ExporterManager } from '@/exporter/ExporterManager';

    module 'fastify' {
        interface FastifyInstance {
            prisma: PrismaClient;
            snowflake: Snowflake;
            exporter: ExporterManager;
        }
        interface FastifyRequest {
            user: User;
        }
    }
}
