import { PrismaClient } from '@prisma/client';
import build from './app';

const prisma = new PrismaClient();

const app = build(prisma,{ logger: true });

app.listen(
    { port: parseInt(process.env.PORT) || 5000, host: '0.0.0.0' },
    (err) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
    },
);
