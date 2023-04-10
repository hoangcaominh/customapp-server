import { FastifyReply, FastifyRequest } from "fastify";
import { Classroom, IClassroom, IClassroomParams, IClassroomWithStatus } from "../models/classroom";
import { getMongoClient } from "../lib/db";
import { IAttendance } from "../models/attendance";

export const getClassroomList = async (request: FastifyRequest, reply: FastifyReply) => {
    // Get classrooms from database
    const availableClassrooms: IClassroom[] = await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IClassroom>("classroom").find({
        endTime: {
            $gte: Date.now()
        }
    }).toArray();

    // Return
    reply.code(200).send(availableClassrooms);
};

export const getClassroomListWithStatus = async (request: FastifyRequest, reply: FastifyReply) => {
    const { studentId } = request.params as { studentId: string };

    // Get classrooms from database
    const availableClassrooms: IClassroom[] = await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IClassroom>("classroom").find({
        endTime: {
            $gte: Date.now()
        }
    }).toArray();

    // Get attendances from database
    const attendanceList: IAttendance[] = await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IAttendance>("attendance").find({
        studentId: studentId
    }).toArray();

    // Convert classroom into classroomWithStatus
    const classroomListWithStatus: IClassroomWithStatus[] = availableClassrooms.map(classroom => {
        return {
            id: classroom.id,
            name: classroom.name,
            secret: classroom.secret,
            startTime: classroom.startTime,
            endTime: classroom.endTime,
            attended: attendanceList.find(attendance => attendance.classroomId == classroom.id) !== undefined
        } as IClassroomWithStatus
    })

    // Return
    reply.code(200).send(classroomListWithStatus);
};

export const getClassroom = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    
    // Get classroom from database
    const classroom = await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IClassroom>("classroom").findOne({
        id: id
    });

    // Check if classroom is available
    if (classroom === null) {
        reply.code(404).send({ message: "Classroom not found." });
        return;
    }

    // Return
    reply.code(200).send(classroom as IClassroom);
};

export const addClassroom = async (request: FastifyRequest, reply: FastifyReply) => {
    const classroomArgs = request.body as IClassroomParams;

    // Create a new classroom with the given name
    const newClassroom = Classroom.newInstance(classroomArgs);

    // Insert to database
    await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IClassroom>("classroom").insertOne(newClassroom);

    reply.code(201).send({ message: `Created classroom ${classroomArgs.name}.` });
};

export const deleteClassroom = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.body as { id: string };

    // Delete classroom in database
    const result = await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IClassroom>("classroom").deleteOne({
        id: id
    });

    if (result.deletedCount == 0) {
        reply.code(404).send({ message: `Classroom not found.` });
    }

    reply.code(201).send({ message: `Classroom ${id} deleted.` });
};
