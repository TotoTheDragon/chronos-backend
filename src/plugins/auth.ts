import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { decode } from '@/util/jwt';
import { toBigInt } from '@/util/util';

const plugin: FastifyPluginAsync = fp(async (instance, _options) => {
    // Initialize the request with a null value, to be changed in the prehandler
    instance.decorateRequest('user', null);

    instance.addHook('preHandler', async (req, reply) => {
        // No authorization found
        if (req.headers.authorization === undefined) {
            return;
        }

        /*
            DEV TESTING
            // TODO remove this
        */
        if (req.headers.authorization.startsWith('Development ')) {
            const id = toBigInt(req.headers.authorization.substring(12));
            req.user = { id: id };
            return;
        }

        // Invalid token, we send back a 400 BAD REQUEST
        if (!req.headers.authorization.startsWith('Bearer ')) {
            return reply.status(400).send();
        }

        const jwt = req.headers.authorization.substring(7);

        const payload = decode(jwt);

        req.user = {
            id: payload.id,
            email: payload.email,
            verified: payload.verified,
            first_name: payload.first_name,
            last_name: payload.last_name,
        };
    });
});

export default plugin;
