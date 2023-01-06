import 'module-alias/register';
import '@/util/patches';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/.env' });

import { validateSnowflake } from '@/util/snowflake';
import autoload from '@fastify/autoload';
import { PrismaClient } from '@prisma/client';
import fastify, { FastifyServerOptions } from 'fastify';
import path from 'path';

export const build = (
    prisma: PrismaClient,
    opts: FastifyServerOptions = {},
) => {
    const app = fastify({
        ...opts,
        ajv: {
            customOptions: {
                formats: {
                    snowflake: {
                        validate: validateSnowflake,
                    },
                },
            },
        },
    });

    app.register(autoload, {
        dir: path.join(__dirname, 'routes'),
    });

    app.register(autoload, {
        dir: path.join(__dirname, 'plugins'),
    });

    app.decorate('prisma', prisma);

    return app;
};

export default build;
