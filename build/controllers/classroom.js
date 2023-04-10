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
exports.deleteClassroom = exports.addClassroom = exports.getClassroom = exports.getClassroomListWithStatus = exports.getClassroomList = void 0;
const classroom_1 = require("../models/classroom");
const db_1 = require("../lib/db");
const getClassroomList = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    // Get classrooms from database
    const availableClassrooms = yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("classroom").find({
        endTime: {
            $gte: Date.now()
        }
    }).toArray();
    // Return
    reply.code(200).send(availableClassrooms);
});
exports.getClassroomList = getClassroomList;
const getClassroomListWithStatus = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = request.params;
    // Get classrooms from database
    const availableClassrooms = yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("classroom").find({
        endTime: {
            $gte: Date.now()
        }
    }).toArray();
    // Get attendances from database
    const attendanceList = yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("attendance").find({
        studentId: studentId
    }).toArray();
    // Convert classroom into classroomWithStatus
    const classroomListWithStatus = availableClassrooms.map(classroom => {
        return {
            id: classroom.id,
            name: classroom.name,
            secret: classroom.secret,
            startTime: classroom.startTime,
            endTime: classroom.endTime,
            attended: attendanceList.find(attendance => attendance.classroomId == classroom.id) !== undefined
        };
    });
    // Return
    reply.code(200).send(classroomListWithStatus);
});
exports.getClassroomListWithStatus = getClassroomListWithStatus;
const getClassroom = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    // Get classroom from database
    const classroom = yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("classroom").findOne({
        id: id
    });
    // Check if classroom is available
    if (classroom === null) {
        reply.code(404).send({ message: "Classroom not found." });
        return;
    }
    // Return
    reply.code(200).send(classroom);
});
exports.getClassroom = getClassroom;
const addClassroom = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const classroomArgs = request.body;
    // Create a new classroom with the given name
    const newClassroom = classroom_1.Classroom.newInstance(classroomArgs);
    // Insert to database
    yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("classroom").insertOne(newClassroom);
    reply.code(201).send({ message: `Created classroom ${classroomArgs.name}.` });
});
exports.addClassroom = addClassroom;
const deleteClassroom = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.body;
    // Delete classroom in database
    const result = yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("classroom").deleteOne({
        id: id
    });
    if (result.deletedCount == 0) {
        reply.code(404).send({ message: `Classroom not found.` });
    }
    reply.code(201).send({ message: `Classroom ${id} deleted.` });
});
exports.deleteClassroom = deleteClassroom;
