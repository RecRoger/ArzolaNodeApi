import mongoose from 'mongoose'
import 'dotenv/config'

const dbuser = process.env.DB_SECRET_USER
const dbpass = process.env.DB_SECRET_PASSWORD
export const dbCS = `mongodb+srv://${dbuser}:${dbpass}@coderhousenodecluster.gabnc.mongodb.net/Coderhouse?retryWrites=true&w=majority`

// DB config
export async function conectToDb() {

    try {
        await mongoose.connect(dbCS)
        console.log('>> DB conected succesfully!')
    } catch (e) {
        throw e
    }
}