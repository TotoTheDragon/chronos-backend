import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async function (
    instance,
    _options,
) {
    /*
        Get current user % HTTP GET /user
    */
    instance.get(
        '/',
        {
            schema: {
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            email: { type: 'string' },
                            first_name: { type: 'string' },
                            last_name: { type: 'string' },
                            verified: { type: 'boolean' },
                        },
                    },
                },
            } as const,
        },
        async (req, reply) => {
            if (req.user === null) {
                return reply.status(401).send();
            }
            return reply.status(200).send(req.user);
        },
    );
};

export default plugin;
