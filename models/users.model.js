import mongoose from "mongoose";

const colectionName = 'users';
export const usersSquema = new mongoose.Schema({
  name: { type: String, required: true},    
  email: { type: String, required: true, unique: true},    
  username: { type: String, required: true, unique: true},    
  role: { type: String, required: true},
  image: { type: String},
  phone: { type: String, required: true},
  address: { type: String},
  password: { type: String, required: true},    
  signUpDate: { type: Date, required: true},
})

export const usersCollection = new mongoose.model(colectionName, usersSquema)
