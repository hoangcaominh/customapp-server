"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMongoClientInit = exports.getMongoClient = exports.newMongoClient = void 0;
const mongodb_1 = require("mongodb");
let clientPromise;
let clientInitialized = false;
function newMongoClient(token) {
    clientPromise = mongodb_1.MongoClient.connect(token);
    clientInitialized = true;
}
exports.newMongoClient = newMongoClient;
function getMongoClient() {
    return clientPromise;
}
exports.getMongoClient = getMongoClient;
function isMongoClientInit() {
    return clientInitialized;
}
exports.isMongoClientInit = isMongoClientInit;
