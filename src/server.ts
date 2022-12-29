import build from './app';

const app = build({ logger: true });

app.listen(
    { port: parseInt(process.env.PORT) || 5000, host: '0.0.0.0' },
    (err) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
    },
);
