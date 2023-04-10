import { randomBytes } from "crypto";
import { QRCodeToDataURLOptions, toDataURL } from "qrcode";

export interface IClassroomParams {
    name: string;
    startTime: number;
    endTime: number;
}

export interface IClassroom extends IClassroomParams {
    id: string;
    secret: string;
    matchSecret(secret: string): boolean;
}

export interface IClassroomWithStatus extends IClassroom {
    attended: boolean;
}

export class Classroom implements IClassroom {
    id: string;
    name: string;
    secret: string;
    startTime: number;
    endTime: number;

    constructor() {
        this.id = "";
        this.name = "";
        this.secret = "";
        this.startTime = 0;
        this.endTime = 0;
    }

    public static newInstance(params: IClassroomParams): Classroom {
        const instance = new Classroom();
        instance.name = params.name;
        instance.id = `COS30017.${Date.now()}`;
        instance.secret = randomBytes(128).toString("base64");
        instance.startTime = params.startTime;
        instance.endTime = params.endTime;
        return instance;
    }
    
    public static import(object: IClassroom): Classroom {
        const instance = new Classroom();
        instance.name = object.name;
        instance.id = object.id;
        instance.secret = object.secret;
        instance.startTime = object.startTime;
        instance.endTime = object.endTime;
        return instance;
    }

    public matchSecret(secret: string): boolean {
        return this.secret === secret
    }

    /**
     * Represents the classroom in QR code
     * @returns Returns a Data URI containing the QR code for this classroom
     */
    public createClassroomScanCode(): Promise<string> {
        const opts: QRCodeToDataURLOptions = {
            errorCorrectionLevel: "L"
        };
        return toDataURL(JSON.stringify({
            id: this.id,
            secret: this.secret
        }), opts);
    }
}
