import { FastifyPluginAsync } from "fastify";
import { addClassroom, deleteClassroom, getClassroom, getClassroomList, getClassroomListWithStatus } from "../controllers/classroom";

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

export const classroomPrefix = {
    prefix: "classroom"
};

export const classroomRoutes: FastifyPluginAsync = async (fastify, options) => {
    // GET classrooms
    fastify.get("/", {
        schema: GetClassroomListSchema,
        handler: getClassroomList
    });
    // GET classrooms with attended status
    fastify.get("/attended/:studentId", {
        schema: GetClassroomListWithStatusSchema,
        handler: getClassroomListWithStatus
    });
    // GET classroom
    fastify.get("/:id", {
        schema: GetClassroomSchema,
        handler: getClassroom
    });
    // POST method
    fastify.post("/", {
        schema: AddClassroomSchema,
        handler: addClassroom
    });
    // DELETE method
    fastify.delete("/", {
        schema: DeleteClassroomSchema,
        handler: deleteClassroom
    });
};
