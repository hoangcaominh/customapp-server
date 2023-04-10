"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const app_1 = require("./app");
const db_1 = require("./lib/db");
const host = process.env.HOST;
const port = Number(process.env.PORT);
const token = process.env.DB_TOKEN;
let app;
let appSecure;
const start = (app, host, port) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, db_1.isMongoClientInit)())
            (0, db_1.newMongoClient)(token);
        yield app.listen({
            host: host,
            port: port
        });
    }
    catch (err) {
        app.log.error(err);
        app.close();
    }
});
function shutdown(signal) {
    console.log(signal + " received. Shutting down...");
    process.exit(0);
}
process
    .on("SIGTERM", () => shutdown("SIGTERM"))
    .on("SIGINT", () => shutdown("SIGINT"));
try {
    app = (0, app_1.build)({
        logger: true
    });
    start(app, host, port);
}
catch (err) {
    console.log("HTTP Exception: " + err);
}
try {
    appSecure = (0, app_1.build)({
        logger: true,
        http2: true,
        https: {
            allowHTTP1: true,
            key: (0, fs_1.readFileSync)(process.env.PATH_SSL_CERT_KEY),
            cert: (0, fs_1.readFileSync)(process.env.PATH_SSL_CERT)
        }
    });
    start(appSecure, host, port + 1);
}
catch (err) {
    console.log("HTTPS Exception: " + err);
}
