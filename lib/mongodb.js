import { MongoClient } from 'mongodb'



export async function connectToDatabase() {
    const MONGODB_URI = process.env.MONGODB_URI

    let client
    let clientPromise

    if (!global._mongoClientPromise) {
        client = new MongoClient(MONGODB_URI)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise

    try {
        const client = await clientPromise
        const db = client.db()
        return { client, db }
    } catch (error) {
        throw new Error('error connect')
    }

}