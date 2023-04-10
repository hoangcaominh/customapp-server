import { FastifyReply, FastifyRequest } from "fastify";
import { IAttendance, IAttendanceWithClassName } from "../models/attendance";
import { Classroom, IClassroom } from "../models/classroom";
import { getMongoClient } from "../lib/db";

export const checkAttendance = async (request: FastifyRequest, reply: FastifyReply) => {
    const { attendance, secret} = request.body as { attendance: IAttendance; secret: string };

    // Get matching classroom from database
    const result = await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IClassroom>("classroom").findOne({
        id: attendance.classroomId
    });

    // Check if classroom exists
    if (result === null) {
        reply.code(404).send({ message: "Classroom not found." });
        return;
    }

    const classroom = Classroom.import(result)

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
    const checked = await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IAttendance>("attendance").findOne({
        classroomId: attendance.classroomId,
        studentId: attendance.studentId
    });
    
    // Check if attendance has already been checked
    if (checked !== null) {
        reply.code(409).send({ message: "Attendance has already been checked." });
        return;
    }

    // Check attendance
    await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IAttendance>("attendance").insertOne(attendance);
    
    reply.code(200).send({ message: "Attendance checked successfully." });
};

export const getAttendanceList = async (request: FastifyRequest, reply: FastifyReply) => {
    const { studentId } = request.params as { studentId: string };

    // Get attendances from database
    const attendanceList: IAttendance[] = await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IAttendance>("attendance").find({
        studentId: studentId
    }).toArray();

    // Return
    reply.code(200).send(attendanceList);
}

export const getAttendanceListWithClassName = async (request: FastifyRequest, reply: FastifyReply) => {
    const { studentId } = request.params as { studentId: string };

    // Get classrooms from database
    const availableClassrooms: IClassroom[] = await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IClassroom>("classroom").find().toArray();

    // Get attendances from database
    const attendanceList: IAttendance[] = await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IAttendance>("attendance").find({
        studentId: studentId
    }).toArray();

    // Convert attendance into attendanceWithClassName
    const attendanceListWithClassName: IAttendanceWithClassName[] = attendanceList.filter(attendance => {
        return availableClassrooms.find(classroom => classroom.id == attendance.classroomId) !== undefined
    }).map(attendance => {
        return {
            studentId: attendance.studentId,
            classroomId: attendance.classroomId,
            classroomName: availableClassrooms.find(classroom => classroom.id == attendance.classroomId)?.name,
            timestamp: attendance.timestamp,
            message: attendance.message
        } as IAttendanceWithClassName
    });

    // Return
    reply.code(200).send(attendanceListWithClassName);
}

export const getClassAttendanceList = async (request: FastifyRequest, reply: FastifyReply) => {
    const { classroomId } = request.params as { classroomId: string };

    // Get attendances from database
    const attendanceList: IAttendance[] = await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IAttendance>("attendance").find({
        classroomId: classroomId
    }).toArray();

    // Return
    reply.code(200).send(attendanceList);
}

export const updateAttendance = async (request: FastifyRequest, reply: FastifyReply) => {
    const { attendance } = request.body as { attendance: IAttendance };

    // Update attendance from database
    const result = await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IAttendance>("attendance").findOneAndReplace({
        studentId: attendance.studentId,
        classroomId: attendance.classroomId
    }, attendance);

    if (!result.ok) {
        reply.code(404).send({ message: "Failed to update attendance. "});
        return;
    }

    reply.code(200).send({ message: "Attendance updated successfully. "});
}

export const deleteAttendance = async (request: FastifyRequest, reply: FastifyReply) => {
    const { studentId, classroomId } = request.body as { studentId: string; classroomId: string };

    // Delete attendance from database
    const result = await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IAttendance>("attendance").findOneAndDelete({
        studentId: studentId,
        classroomId: classroomId
    });

    if (!result.ok) {
        reply.code(404).send({ message: "Failed to delete attendance. "});
        return;
    }

    reply.code(200).send({ message: "Attendance deleted successfully. "});
}
