import { build } from './app';

const app = build({ logger: true });

app.listen(process.env.PORT || 5000, '0.0.0.0', (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
});
