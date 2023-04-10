"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Classroom = void 0;
const crypto_1 = require("crypto");
const qrcode_1 = require("qrcode");
class Classroom {
    constructor() {
        this.id = "";
        this.name = "";
        this.secret = "";
        this.startTime = 0;
        this.endTime = 0;
    }
    static newInstance(params) {
        const instance = new Classroom();
        instance.name = params.name;
        instance.id = `COS30017.${Date.now()}`;
        instance.secret = (0, crypto_1.randomBytes)(128).toString("base64");
        instance.startTime = params.startTime;
        instance.endTime = params.endTime;
        return instance;
    }
    static import(object) {
        const instance = new Classroom();
        instance.name = object.name;
        instance.id = object.id;
        instance.secret = object.secret;
        instance.startTime = object.startTime;
        instance.endTime = object.endTime;
        return instance;
    }
    matchSecret(secret) {
        return this.secret === secret;
    }
    /**
     * Represents the classroom in QR code
     * @returns Returns a Data URI containing the QR code for this classroom
     */
    createClassroomScanCode() {
        const opts = {
            errorCorrectionLevel: "L"
        };
        return (0, qrcode_1.toDataURL)(JSON.stringify({
            id: this.id,
            secret: this.secret
        }), opts);
    }
}
exports.Classroom = Classroom;
