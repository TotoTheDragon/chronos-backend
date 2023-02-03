
declare global {
    import { Snowflake } from '@/util/snowflake';
    import { PrismaClient, User } from '@prisma/client';

    module 'fastify' {
        import {Exporter} from "@/util/exporter/exporter";

        interface FastifyInstance {
            prisma: PrismaClient;
            snowflake: Snowflake;
            exporter: Exporter;
        }
        interface FastifyRequest {
            user: User;
        }
    }
}
