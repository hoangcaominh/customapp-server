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
exports.getClassrooms = void 0;
const classroom_1 = require("../models/classroom");
const db_1 = require("../lib/db");
const getClassrooms = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const availableClassrooms = [];
    // Get classrooms from database
    yield (yield (0, db_1.getMongoClient)()).db(process.env.DB_CLASSROOM).collection("classroom").find().forEach(entry => {
        availableClassrooms.push(classroom_1.Classroom.import(entry));
    });
    // Print classrooms to webpage
    let html = "";
    for (const classroom of availableClassrooms.reverse()) {
        const qr = yield classroom.createClassroomScanCode();
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
});
exports.getClassrooms = getClassrooms;
