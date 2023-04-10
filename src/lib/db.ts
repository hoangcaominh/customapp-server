import { MongoClient } from "mongodb"

let clientPromise: Promise<MongoClient>;
let clientInitialized = false;

export function newMongoClient(token: string) {
    clientPromise = MongoClient.connect(token);
    clientInitialized = true;
}

export function getMongoClient(): Promise<MongoClient> {
    return clientPromise;
}

export function isMongoClientInit(): boolean {
    return clientInitialized;
}
