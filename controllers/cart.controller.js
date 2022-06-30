import { Router } from 'express'
import { FileManager } from "../db/fileManager.js";
import { productFile } from "../controllers/products.controller.js";


export class CartData {
    constructor(name, description, price, stock, thumbnail) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.thumbnail = thumbnail;
        this.timestamp = new Date()
    }
}

export const cartFile = new FileManager('carts', []);


export const CreateCart = async (req, res) => {
    console.log('> Crea nuevo carrito')
    const id = req.body?.id
    const product = await productFile.getById(id)
    console.log('> Añadir elemento', product)
    const data = {
        timestamp: Date.now(),
        products: [product]
    }
    let newCart = await cartFile.save(data);

    return res.status(200).json((newCart && {id: newCart.id, timestamp: newCart.timestamp}) || {error: "No cart"})
}

export const GetCart = async (req, res) => {
    const id = Number(req.params.id)
    console.log('> Consultar elemento carrito ', id)
    let item = await cartFile.getById(id);
    return res.status(200).json((item && item.products) || [])
}
 
export const AddToCart = async (req, res) => {
    const id = Number(req.params.id)
    const productId = req.body?.id
    if(!id || !productId) {
        console.log('> ids invalidos')
        return res.status(400).json({error:'invalid Ids'})
    }
    console.log('> Añadir product ', productId,' al cart ', id)
    const cart = await cartFile.getById(id)
    const product = await productFile.getById(productId)

    if(!cart?.products?.length || !product?.id) {
        console.log('> No hay productos')
        return res.status(404).json({error:'no products'})
    }

    cart.products.push(product)
    
    let edition = await cartFile.update(id, cart);

    return res.status(200).json((edition && {id}) || {error: 'no data'} )
}

export const RemoveFromCar = async (req, res) => {
    const id = Number(req.params.id)
    const productId =Number(req.params.productId)
    if(!id || !productId) {
        console.log('> ids invalidos')
        return res.status(400).json({error:'invalid Ids'})
    }
    const cart = await cartFile.getById(id)
    
    if(!cart?.products?.length) {
        console.log('> No cart')
        return res.status(404).json({error:'no cart'})
    }

    cart.products = cart.products.filter(product=> product.id !== productId)

    if(!cart.products.length) {
        console.log('> Vaciar carrito ', id)
        let edition = await cartFile.deleteById(id);
        return res.status(200).json((edition && {id, msg: 'Deleted'}) || {'error': 'no delete'})
    }

    let edition = await cartFile.update(id, cart);
    return res.status(200).json((edition && {id}) || {error: 'no data'} )
}

export const FlushCart = async (req, res) => {
    const id = Number(req.params.id)
    console.log('> Vaciar carrito ', id)
    let edition = await cartFile.deleteById(id);
    return res.status(200).json((edition && {id, msg: 'Deleted'}) || {'error': 'no delete'})
}