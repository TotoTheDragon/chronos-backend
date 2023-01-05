import * as dotenv from 'dotenv';
dotenv.config({ path: '/.env' });

import fastify, { FastifyServerOptions } from 'fastify';
import { validateSnowflake } from './util/snowflake';

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

    return app;
};

export default build;
