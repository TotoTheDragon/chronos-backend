declare global {
    import { PrismaClient, User } from '@prisma/client';

    module 'fastify' {
        interface FastifyInstance {
            prisma: PrismaClient;
        }
        interface FastifyRequest {
            user: User
        }
    }
}
