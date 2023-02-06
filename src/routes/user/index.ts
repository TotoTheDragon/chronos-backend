import { decode, encode, encrypt } from '@/util/auth';
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

    /*
        Create new user % HTTP POST /user
    */
    instance.post(
        '/',
        {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        password: { type: 'string' },
                        email: { type: 'string' },
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                    },
                },
            } as const,
        },
        async (req, reply) => {
            /*  
                Make sure no account exists with this email
            */
            if (
                null !==
                (await instance.prisma.user.findFirst({
                    where: { email: req.body.email },
                }))
            ) {
                reply.status(409).send();
            }

            /*
                Create account
            */
            const id = instance.snowflake.generate();
            const hashedPassword = encrypt(req.body.password);
            const verifyToken = encode({ id }, '30m');

            const user = await instance.prisma.user.create({
                data: {
                    id: id,
                    password: hashedPassword,
                    email: req.body.email,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                },
            });

            /*
                Send email
            */
            console.log(verifyToken);

            /*
                Finish request
            */
            reply.status(201).send(user);
        },
    );

    /*

    */
    instance.get(
        '/verify/:token',
        {
            schema: {
                querystring: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                    },
                },
            } as const,
        },
        async (req, reply) => {
            const payload = decode(req.query.token);

            // Get user that needs to be verified, should exist, throw error if it does not
            const user = await instance.prisma.user.findFirstOrThrow({
                where: { id: payload.id },
            });

            // Already verified
            if (user.verified) {
                reply.status(404).send();
                return;
            }

            await instance.prisma.user.update({
                where: { id: payload.id },
                data: { verified: true },
            });

            reply.redirect(301, instance.server.address.toString());
        },
    );
};

export default plugin;
