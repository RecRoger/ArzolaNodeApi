import mongoose from "mongoose";

const colectionName = 'products';
export const productsSquema = new mongoose.Schema({
    id: { type: String, required: true},
    name: { type: String, required: true},
    description: { type: String, required: true},
    price: { type: Number, required: true},
    stock: { type: Number, required: true},
    thumbnail: { type: String, required: true},
    timestamp: { type: Date, required: true},
})

export const productsCollection = new mongoose.model(colectionName, productsSquema)
