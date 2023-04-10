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
exports.classroomRoutes = exports.classroomPrefix = void 0;
const classroom_1 = require("../controllers/classroom");
const MessageObject = {
    type: "object",
    properties: {
        message: { type: "string" }
    }
};
const RequiredClassroomObject = {
    type: "object",
    required: ["name"],
    properties: {
        name: { type: "string" }
    }
};
const ClassroomObject = {
    type: "object",
    properties: {
        id: { type: "string" },
        name: { type: "string" },
        startTime: { type: "number" },
        endTime: { type: "number" }
    }
};
const GetClassroomListSchema = {
    response: {
        200: {
            type: "array",
            items: ClassroomObject
        }
    }
};
const GetClassroomListWithStatusSchema = {
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    startTime: { type: "number" },
                    endTime: { type: "number" },
                    attended: { type: "boolean" }
                }
            }
        }
    }
};
const GetClassroomSchema = {
    response: {
        200: ClassroomObject,
        404: MessageObject
    }
};
const AddClassroomSchema = {
    body: RequiredClassroomObject,
    response: {
        201: MessageObject
    }
};
const DeleteClassroomSchema = {
    body: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string" }
        }
    },
    response: {
        200: MessageObject,
        404: MessageObject
    }
};
exports.classroomPrefix = {
    prefix: "classroom"
};
const classroomRoutes = (fastify, options) => __awaiter(void 0, void 0, void 0, function* () {
    // GET classrooms
    fastify.get("/", {
        schema: GetClassroomListSchema,
        handler: classroom_1.getClassroomList
    });
    // GET classrooms with attended status
    fastify.get("/attended/:studentId", {
        schema: GetClassroomListWithStatusSchema,
        handler: classroom_1.getClassroomListWithStatus
    });
    // GET classroom
    fastify.get("/:id", {
        schema: GetClassroomSchema,
        handler: classroom_1.getClassroom
    });
    // POST method
    fastify.post("/", {
        schema: AddClassroomSchema,
        handler: classroom_1.addClassroom
    });
    // DELETE method
    fastify.delete("/", {
        schema: DeleteClassroomSchema,
        handler: classroom_1.deleteClassroom
    });
});
exports.classroomRoutes = classroomRoutes;
