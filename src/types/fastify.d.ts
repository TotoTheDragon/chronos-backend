declare global {
    import { Snowflake } from '@/util/snowflake';
    import { PrismaClient, User } from '@prisma/client';

    module 'fastify' {
        interface FastifyInstance {
            prisma: PrismaClient;
            snowflake: Snowflake;
        }
        interface FastifyRequest {
            user: User;
        }
    }
}
