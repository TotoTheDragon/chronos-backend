import * as dotenv from 'dotenv';
dotenv.config({ path: '/.env' });

import fastify, { FastifyServerOptions } from 'fastify';
import { validateSnowflake } from './util/snowflake';
import path from 'path';
import autoload from '@fastify/autoload';
import { PrismaClient } from '@prisma/client';

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
