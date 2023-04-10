import { config } from "dotenv";
import Fastify, { FastifyInstance } from "fastify";
import { classroomPrefix, classroomRoutes } from "./routes/classroom";
import { attendancePrefix, attendanceRoutes } from "./routes/attendance";
import { adminPrefix, adminRoutes } from "./routes/admin";
import { indexPrefix, indexRoutes } from "./routes/index";

// load dotenv configurations
try {
    config();
} catch (err) {
    console.log("Failed to load dotenv configurations. Error: " + err);
    process.exit(1);
}

export const build = (opts = {}): FastifyInstance => {
    const app = Fastify(opts);

    app.register(indexRoutes, indexPrefix);
    app.register(classroomRoutes, classroomPrefix);
    app.register(attendanceRoutes, attendancePrefix);
    app.register(adminRoutes, adminPrefix);

    return app;
};
