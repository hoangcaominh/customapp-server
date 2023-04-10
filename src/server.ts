import { FastifyInstance } from "fastify";
import { readFileSync } from "fs";
import { build } from "./app";
import { isMongoClientInit, newMongoClient } from "./lib/db";

const host = process.env.HOST as string;
const port = Number(process.env.PORT);
const token = process.env.DB_TOKEN as string;

let app: FastifyInstance;
let appSecure: FastifyInstance;

const start = async (app: FastifyInstance, host: string, port: number) => {
    try {
        if (!isMongoClientInit())
            newMongoClient(token);

        await app.listen({
            host: host,
            port: port
        });
    } catch (err) {
        app.log.error(err);
        app.close();
    }
};

function shutdown(signal: string) {
    console.log(signal + " received. Shutting down...");
    process.exit(0);
}

process
    .on("SIGTERM", () => shutdown("SIGTERM"))
    .on("SIGINT", () => shutdown("SIGINT"));

try {
    app = build({
        logger: true
    });

    start(app, host, port);
} catch (err) {
    console.log("HTTP Exception: " + err);
}

try {
    appSecure = build({
        logger: true,
        http2: true,
        https: {
            allowHTTP1: true,
            key: readFileSync(process.env.PATH_SSL_CERT_KEY as string),
            cert: readFileSync(process.env.PATH_SSL_CERT as string)
        }
    });

    start(appSecure, host, port + 1);
} catch (err) {
    console.log("HTTPS Exception: " + err);
}

