/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION shutting down 🔥');
    process.exit(1);
});

const app = require('./app');

// const DB = process.env.DATABASE_LOCAL;
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

async function main() {
    await mongoose.connect(
        DB,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        },
        (err) => {
            if (err) process.exit(1);
            console.log('db connected successfully');
        }
    );
}
main().catch((err) => console.log(err));

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`this app is listening on port ${port}....`);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDELED REJECTION shutting down 🔥');
    server.close(() => {
        process.exit(1);
    });
});
