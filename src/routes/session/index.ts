import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { toBigInt } from '../../util/util';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async function (
    instance,
    _options,
) {
    /*
        Get sessions % HTTP GET /sessions
    */
    instance.get(
        '/',
        {
            schema: {
                querystring: {
                    type: 'object',
                    properties: {
                        before: { type: 'string', format: 'snowflake' },
                        after: { type: 'string', format: 'snowflake' },
                        limit: { type: 'number', minimum: 1, default: 25 },
                    },
                },
            } as const,
        },
        async (req, reply) => {
            if (req.user === undefined) {
                return reply.status(401).send();
            }

            const sessions = await instance.prisma.session.findMany({
                take: req.query.limit,
                where: {
                    id: {
                        gt: toBigInt(req.query.after),
                        lt: toBigInt(req.query.before),
                    },
                    user: {
                        equals: req.user.id,
                    },
                },
            });

            return reply.status(200).send(sessions);
        },
    );
};

export default plugin;
