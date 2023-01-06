import sessionSchema from '@/schemas/session';
import { toBigInt } from '@/util/util';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

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
                response: {
                    200: {
                        type: 'array',
                        items: sessionSchema,
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

    /*
        Create session % HTTP POST /sessions
    */
    instance.post(
        '/',
        {
            schema: {
                response: {
                    201: {
                        type: 'array',
                        items: sessionSchema,
                    },
                },
            },
        },
        async (req, reply) => {
            if (req.user === undefined) {
                return reply.status(401).send();
            }

            const userSession = await instance.prisma.session.findFirst({
                take: -1,
                where: {
                    user: req.user.id,
                },
            });

            // If the user has a previous session, make sure that it has ended
            if (
                userSession !== null &&
                userSession.original_end_time === null
            ) {
                return reply.status(409).send();
            }

            const id = instance.snowflake.generate();
            const startTime = new Date();

            const session = await instance.prisma.session.create({
                data: {
                    id: id,
                    original_start_time: startTime,
                    start_time: startTime,
                    user: req.user.id,
                },
            });

            return reply.status(201).send(session);
        },
    );

    /*
        Edit session % HTTP PATCH /sessions/{session.id}
    */
    instance.patch(
        '/:id',
        {
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                    },
                },
                body: {
                    type: 'object',
                    properties: {
                        description: { type: 'string' },
                        start_time: { type: 'string', format: 'date-time' },
                        end_time: { type: 'string', format: 'date-time' },
                        original_end_time: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                response: {
                    200: {
                        type: 'array',
                        items: sessionSchema,
                    },
                },
            } as const,
        },
        async (req, reply) => {
            if (req.user === undefined) {
                return reply.status(401).send();
            }

            // Get session by id and user id
            const session = await instance.prisma.session.findFirst({
                where: {
                    id: toBigInt(req.params.id),
                    user: req.user.id,
                },
            });

            // If the user does not have a session with this id, we send back a 404 NOT FOUND
            if (session === null) {
                return reply.status(404).send();
            }

            // If the session has not been ended, and this request does not end it, we send back a 409 CONFLICT
            if (
                session.original_end_time === null &&
                req.body.original_end_time === undefined
            ) {
                return reply.status(409).send();
            }

            // If the session has already ended, and the request tries to end it, we send back a 409 CONFLICT
            if (
                session.original_end_time !== null &&
                req.body.original_end_time !== undefined
            ) {
                return reply.status(409).send();
            }

            // If the session has not ended yet, and no end_time was supplied, set it to the original_end_time
            if (
                session.original_end_time === null &&
                req.body.end_time === undefined
            ) {
                req.body.end_time = req.body.original_end_time;
            }
            // Update the session in the database
            const patchedSession = await instance.prisma.session.update({
                where: {
                    id: session.id,
                },
                data: req.body,
            });

            reply.status(200).send(patchedSession);
        },
    );
};

export default plugin;
