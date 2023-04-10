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
exports.deleteAttendance = exports.updateAttendance = exports.getClassAttendanceList = exports.getAttendanceListWithClassName = exports.getAttendanceList = exports.checkAttendance = void 0;
const classroom_1 = require("../models/classroom");
const db_1 = require("../lib/db");
const checkAttendance = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { attendance, secret } = request.body;
    // Get matching classroom from database
    const result = yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("classroom").findOne({
        id: attendance.classroomId
    });
    // Check if classroom exists
    if (result === null) {
        reply.code(404).send({ message: "Classroom not found." });
        return;
    }
    const classroom = classroom_1.Classroom.import(result);
    // Check if secret matches
    if (!classroom.matchSecret(secret)) {
        reply.code(403).send({ message: "Secret does not match." });
        return;
    }
    // Check if attendance is late
    if (classroom.endTime < attendance.timestamp) {
        reply.code(418).send({ message: "You are late for this class." });
        return;
    }
    // Get attendance list from database
    const checked = yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("attendance").findOne({
        classroomId: attendance.classroomId,
        studentId: attendance.studentId
    });
    // Check if attendance has already been checked
    if (checked !== null) {
        reply.code(409).send({ message: "Attendance has already been checked." });
        return;
    }
    // Check attendance
    yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("attendance").insertOne(attendance);
    reply.code(200).send({ message: "Attendance checked successfully." });
});
exports.checkAttendance = checkAttendance;
const getAttendanceList = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = request.params;
    // Get attendances from database
    const attendanceList = yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("attendance").find({
        studentId: studentId
    }).toArray();
    // Return
    reply.code(200).send(attendanceList);
});
exports.getAttendanceList = getAttendanceList;
const getAttendanceListWithClassName = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = request.params;
    // Get classrooms from database
    const availableClassrooms = yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("classroom").find().toArray();
    // Get attendances from database
    const attendanceList = yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("attendance").find({
        studentId: studentId
    }).toArray();
    // Convert attendance into attendanceWithClassName
    const attendanceListWithClassName = attendanceList.filter(attendance => {
        return availableClassrooms.find(classroom => classroom.id == attendance.classroomId) !== undefined;
    }).map(attendance => {
        var _a;
        return {
            studentId: attendance.studentId,
            classroomId: attendance.classroomId,
            classroomName: (_a = availableClassrooms.find(classroom => classroom.id == attendance.classroomId)) === null || _a === void 0 ? void 0 : _a.name,
            timestamp: attendance.timestamp,
            message: attendance.message
        };
    });
    // Return
    reply.code(200).send(attendanceListWithClassName);
});
exports.getAttendanceListWithClassName = getAttendanceListWithClassName;
const getClassAttendanceList = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { classroomId } = request.params;
    // Get attendances from database
    const attendanceList = yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("attendance").find({
        classroomId: classroomId
    }).toArray();
    // Return
    reply.code(200).send(attendanceList);
});
exports.getClassAttendanceList = getClassAttendanceList;
const updateAttendance = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { attendance } = request.body;
    // Update attendance from database
    const result = yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("attendance").findOneAndReplace({
        studentId: attendance.studentId,
        classroomId: attendance.classroomId
    }, attendance);
    if (!result.ok) {
        reply.code(404).send({ message: "Failed to update attendance. " });
        return;
    }
    reply.code(200).send({ message: "Attendance updated successfully. " });
});
exports.updateAttendance = updateAttendance;
const deleteAttendance = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, classroomId } = request.body;
    // Delete attendance from database
    const result = yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("attendance").findOneAndDelete({
        studentId: studentId,
        classroomId: classroomId
    });
    if (!result.ok) {
        reply.code(404).send({ message: "Failed to delete attendance. " });
        return;
    }
    reply.code(200).send({ message: "Attendance deleted successfully. " });
});
exports.deleteAttendance = deleteAttendance;
