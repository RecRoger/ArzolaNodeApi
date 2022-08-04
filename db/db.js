import mongoose from 'mongoose'

const dbuser = 'MongoNodeApp'
const dbpass = 'Coderhouse'
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