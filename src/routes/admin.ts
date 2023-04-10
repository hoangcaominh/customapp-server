import { FastifyPluginAsync } from "fastify";
import { getClassrooms } from "../controllers/admin";

export const adminPrefix = {
    prefix: "admin"
}

export const adminRoutes: FastifyPluginAsync = async (fastify, options) => {
    // GET method
    fastify.get("/", {
        handler: getClassrooms
    });
};
