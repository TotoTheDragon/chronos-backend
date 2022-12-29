import * as dotenv from 'dotenv';
dotenv.config({ path: '/.env' });

import fastify from 'fastify';

export const build = (opts = {}) => {
    const app = fastify(opts);

    return app;
};

export default build;
