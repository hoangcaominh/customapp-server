import { FastifyReply, FastifyRequest } from "fastify";
import { Classroom, IClassroom } from "../models/classroom";
import { getMongoClient } from "../lib/db";

export const getClassrooms = async (request: FastifyRequest, reply: FastifyReply) => {
    const availableClassrooms: Classroom[] = [];

    // Get classrooms from database
    await (await getMongoClient()).db(process.env.DB_CLASSROOM).collection<IClassroom>("classroom").find().forEach(entry => {
        availableClassrooms.push(Classroom.import(entry));
    });

    // Print classrooms to webpage
    let html = ""
    for (const classroom of availableClassrooms.reverse()) {
        const qr = await classroom.createClassroomScanCode();
        html += `
            <div>
                <p><strong>${classroom.name} - ${classroom.id}</strong></p>
                <p><strong>From:</strong> ${new Date(classroom.startTime).toLocaleString()}</p>
                <p><strong>To:</strong> ${new Date(classroom.endTime).toLocaleString()}</p>
                <a href="${qr}" target="_blank">Open QR code in New tab</a>
                <br>
                <img src="${qr}"/>
            </div>
        `;
    }
    
    reply.type("text/html").code(200).send(html);
};
