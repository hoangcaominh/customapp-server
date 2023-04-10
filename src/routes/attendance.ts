import { FastifyPluginAsync } from "fastify";
import { checkAttendance, deleteAttendance, getAttendanceList, getAttendanceListWithClassName, getClassAttendanceList, updateAttendance } from "../controllers/attendance";

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
}

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

export const attendancePrefix = {
    prefix: "attendance"
};

export const attendanceRoutes: FastifyPluginAsync = async (fastify, options) => {
    // GET method
    fastify.get("/:studentId", {
        schema: GetAttendanceListSchema,
        handler: getAttendanceList
    });
    // GET method with class name
    fastify.get("/classname/:studentId", {
        schema: GetAttendanceListWithClassNameSchema,
        handler: getAttendanceListWithClassName
    });
    // GET method with class attendance
    fastify.get("/classattend/:classroomId", {
        schema: GetClassAttendanceListSchema,
        handler: getClassAttendanceList
    });
    // POST method
    fastify.post("/", {
        schema: CheckSchema,
        handler: checkAttendance
    });
    // PUT method
    fastify.put("/", {
        schema: UpdateAttendanceSchema,
        handler: updateAttendance
    });
    // DELETE method
    fastify.delete("/", {
        schema: DeleteAttendanceSchema,
        handler: deleteAttendance
    });
};
