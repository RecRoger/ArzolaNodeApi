import mongoose from "mongoose";

const colectionName = 'carts';
export const cartsSquema = new mongoose.Schema({
    id: { type: String, required: true},
    timestamp: { type: Date, required: true},
    products: [{
        id: { type: String, required: true},
        name: { type: String, required: true},
        description: { type: String, required: true},
        price: { type: Number, required: true},
        stock: { type: Number, required: true},
        thumbnail: { type: String, required: true},
        timestamp: { type: Date, required: true},
    }]
    
})

export const cartsCollection = new mongoose.model(colectionName, cartsSquema)
