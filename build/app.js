"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const dotenv_1 = require("dotenv");
const fastify_1 = __importDefault(require("fastify"));
const classroom_1 = require("./routes/classroom");
const attendance_1 = require("./routes/attendance");
const admin_1 = require("./routes/admin");
const index_1 = require("./routes/index");
// load dotenv configurations
try {
    (0, dotenv_1.config)();
}
catch (err) {
    console.log("Failed to load dotenv configurations. Error: " + err);
    process.exit(1);
}
const build = (opts = {}) => {
    const app = (0, fastify_1.default)(opts);
    app.register(index_1.indexRoutes, index_1.indexPrefix);
    app.register(classroom_1.classroomRoutes, classroom_1.classroomPrefix);
    app.register(attendance_1.attendanceRoutes, attendance_1.attendancePrefix);
    app.register(admin_1.adminRoutes, admin_1.adminPrefix);
    return app;
};
exports.build = build;
