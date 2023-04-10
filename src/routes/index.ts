import { FastifyPluginAsync } from "fastify";
import { getIndex } from "../controllers";

export const indexPrefix = {
    prefix: ""
}

export const indexRoutes: FastifyPluginAsync = async (fastify, options) => {
    // GET method
    fastify.get("/", {
        handler: getIndex
    });
};
