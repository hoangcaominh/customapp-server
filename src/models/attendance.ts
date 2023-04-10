export interface IAttendance {
    studentId: string;
    classroomId: string;
    timestamp: number;
    message: string;
}

export interface IAttendanceWithClassName extends IAttendance {
    classroomName: string;
}
