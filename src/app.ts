import * as dotenv from 'dotenv';
dotenv.config({ path: '/.env' });

import fastify, { FastifyServerOptions } from 'fastify';
import { validateSnowflake } from './util/snowflake';
import path from 'path';
import autoload from '@fastify/autoload';

export const build = (opts: FastifyServerOptions = {}) => {
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

    return app;
};

export default build;
