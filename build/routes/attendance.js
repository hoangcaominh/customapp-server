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
exports.attendanceRoutes = exports.attendancePrefix = void 0;
const attendance_1 = require("../controllers/attendance");
const MessageObject = {
    type: "object",
    properties: {
        message: { type: "string" }
    }
};
const AttendanceObject = {
    type: "object",
    properties: {
        studentId: { type: "string" },
        classroomId: { type: "string" },
        timestamp: { type: "number" },
        message: { type: "string" }
    }
};
const RequiredAttendanceObject = {
    type: AttendanceObject.type,
    required: ["studentId", "classroomId", "timestamp", "message"],
    properties: AttendanceObject.properties
};
const RequiredCheckAttendanceObject = {
    type: "object",
    required: ["attendance", "secret"],
    properties: {
        attendance: RequiredAttendanceObject,
        secret: { type: "string" },
    }
};
const RequiredUpdateAttendanceObject = {
    type: "object",
    required: ["attendance"],
    properties: {
        attendance: RequiredAttendanceObject
    }
};
const CheckSchema = {
    body: RequiredCheckAttendanceObject,
    response: {
        200: MessageObject,
        403: MessageObject,
        404: MessageObject,
        409: MessageObject
    }
};
const GetAttendanceListSchema = {
    response: {
        200: {
            type: "array",
            items: AttendanceObject
        }
    }
};
const GetAttendanceListWithClassNameSchema = {
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    studentId: { type: "string" },
                    classroomId: { type: "string" },
                    classroomName: { type: "string" },
                    timestamp: { type: "number" },
                    message: { type: "string" }
                }
            }
        }
    }
};
const GetClassAttendanceListSchema = {
    response: {
        200: {
            type: "array",
            items: AttendanceObject
        }
    }
};
const UpdateAttendanceSchema = {
    body: RequiredUpdateAttendanceObject,
    response: {
        200: MessageObject,
        404: MessageObject
    }
};
const DeleteAttendanceSchema = {
    body: {
        type: "object",
        required: ["studentId", "classroomId"],
        properties: {
            studentId: { type: "string" },
            classroomId: { type: "string" }
        }
    },
    response: {
        200: MessageObject,
        404: MessageObject
    }
};
exports.attendancePrefix = {
    prefix: "attendance"
};
const attendanceRoutes = (fastify, options) => __awaiter(void 0, void 0, void 0, function* () {
    // GET method
    fastify.get("/:studentId", {
        schema: GetAttendanceListSchema,
        handler: attendance_1.getAttendanceList
    });
    // GET method with class name
    fastify.get("/classname/:studentId", {
        schema: GetAttendanceListWithClassNameSchema,
        handler: attendance_1.getAttendanceListWithClassName
    });
    // GET method with class attendance
    fastify.get("/classattend/:classroomId", {
        schema: GetClassAttendanceListSchema,
        handler: attendance_1.getClassAttendanceList
    });
    // POST method
    fastify.post("/", {
        schema: CheckSchema,
        handler: attendance_1.checkAttendance
    });
    // PUT method
    fastify.put("/", {
        schema: UpdateAttendanceSchema,
        handler: attendance_1.updateAttendance
    });
    // DELETE method
    fastify.delete("/", {
        schema: DeleteAttendanceSchema,
        handler: attendance_1.deleteAttendance
    });
});
exports.attendanceRoutes = attendanceRoutes;
