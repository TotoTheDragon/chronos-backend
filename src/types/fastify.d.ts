declare global {
    import { PrismaClient } from '@prisma/client';

    module 'fastify' {
        interface FastifyInstance {
            prisma: PrismaClient;
        }
    }
}
