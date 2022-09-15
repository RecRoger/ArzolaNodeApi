// import { FileManager } from "../db/fileManager.js";
// import { productFile } from "../controllers/products.controller.js";
import { productsCollection } from '../models/products.model.js'
import { cartsCollection } from '../models/carts.model.js'
import { usersCollection } from '../models/users.model.js'
import { logger } from '../logger.js'
import {asyncSendText, asyncSendMail} from '../commons/utils.js'

/**  IMPLEMENTACION VIEJA CON Files 
 * 
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
*/

export const CreateCart = async (req, res) => {
    logger.info('> Crea nuevo carrito')
    const id = req.body?.id

    try {
        // const product = await productFile.getById(id)
        let products = await productsCollection.find({id: id}, { 
            _v: 0,
        });
        const [product] = products
        if(!product) {
            return res.status(404).json({error: "Invalid Product"})
        }
        logger.info('> - Añadir elemento', product.name, ' al nuevo cart')
        const data = {
            id: Date.now().toString(),
            timestamp: new Date(),
            products: [product]
        }

        let insertion = await cartsCollection.insertMany([data])
        let [newCart] = insertion
        // let newCart = await cartFile.save(data);
    
        return res.status(200).json((newCart && {id: newCart.id, timestamp: newCart.timestamp}) || {error: "No cart"})

    } catch (e) {
        return res.status(200).json({message: "No cart", error: e})
    }
}

export const AddToCart = async (req, res) => {
    logger.info('> Añadir producto a carrito')
    const id = req.params.id
    const productId = req.body?.id
    
    try {
        if(!id || !productId) {
            logger.warn('> ids invalidos')
            return res.status(400).json({error:'invalid Ids'})
        }
        logger.info('> - Añadir product ', productId,' al cart ', id)
        
        let products = await productsCollection.find({id: productId}, { 
            _v: 0,
        });
        const [product] = products
        if(!product || !product?.id) {
            logger.warn('> No hay productos')
            return res.status(404).json({error: "Invalid Product"})
        }
        
        const edition = await cartsCollection.updateOne({id}, {
            $push: {
                products: product
            }
        })

        // const cart = await cartFile.getById(id)
        // cart.products.push(product)
        // let edition = await cartFile.update(id, cart);
    
        return res.status(200).json((edition.acknowledged && {id}) || {error: 'no data'} )
        
    } catch (e) {
        return res.status(200).json({message: 'no data', error: e} )
    }
    
}

export const GetCart = async (req, res) => {
    const id = req.params.id
    logger.info('> Consultar carrito ', id)
    try {
        // let item = await cartFile.getById(id);
        const items = await cartsCollection.find({id}, {
            _v: 0,
            _id: 0,
            "products._id": 0,
            "products._v": 0,
            "products.timestamp": 0
        })
        const [item] = items
        return res.status(200).json((item && item.products) || [])
        
    } catch (e) {
        return res.status(400).json({message: 'no cart', error: e})
    }
}

export const RemoveFromCar = async (req, res) => {
    const id = req.params.id
    const productId = req.params.productId
    logger.info('> Eliminar producto', product ,' del carrito', id)
    if(!id || !productId) {
        logger.warn('> ids invalidos')
        return res.status(400).json({error:'invalid Ids'})
    }
    
    try {
        // const cart = await cartFile.getById(id)
        // if(!cart?.products?.length) {
        //     logger.info('> No cart')
        //     return res.status(404).json({error:'no cart'})
        // }
        // cart.products = cart.products.filter(product=> product.id !== productId)
        // if(!cart.products.length) {
        //     logger.warn('> Vaciar carrito ', id)
        //     let edition = await cartFile.deleteById(id);
        //     return res.status(200).json((edition && {id, msg: 'Deleted'}) || {'error': 'no delete'})
        // }
        // let edition = await cartFile.update(id, cart);
        
        const edition = await cartsCollection.updateOne({id}, {
            $pull: {
                products: {id: productId}
            }
        })

        const cart = await cartsCollection.findOne({id})
        if (cart && !cart?.products?.length) {
            logger.info('> vaciar lista:', id)
            const edition2 = await cartsCollection.deleteOne({id})
            return res.status(200).json((edition2.acknowledged && {id, msg: 'Deleted'}) || {'error': 'no delete'})
        }

        return res.status(200).json((edition.acknowledged && {id}) || {error: 'no data'} )
        
    } catch (e) {
        return res.status(400).json({message: 'no data', error: e} )

    }
}

export const FlushCart = async (req, res) => {
    const id = req.params.id
    logger.info('> Vaciar carrito ', id)

    try {
        // let edition = await cartFile.deleteById(id);
        
        const edition = await cartsCollection.deleteOne({id})
        return res.status(200).json((edition.acknowledged && {id, msg: 'Deleted'}) || {'error': 'no delete'})
        
    } catch (e) {
        return res.status(200).json({'message': 'no delete', error: e})
    }
}

export const PurchaseCart = async (req, res) => {
    const cartId = req.body.cartId
    const username = req.body.username

    logger.info('> Generar orden de compra ')
    logger.info('> Cart: ', cartId)
    logger.info('> User: ', username)

    try {
        
        const users = await usersCollection.find({username}, {
            password: 0
        })
        const [user] = users
        const items = await cartsCollection.find({id: cartId}, {
            _v: 0,
            _id: 0,
            "products._id": 0,
            "products._v": 0,
            "products.timestamp": 0
        })
        const [item] = items

        
        if(user && item?.products?.length) {

            
            await asyncSendMail('Nuevo Pedido de ' + user.name, `
                <h3>Nueva orden de compra: ${item.id}</h3>
                ${(new Date()).toLocaleDateString()}
                <br>
                <table>
                    <tr>
                        <th>Product</th>
                        <th>stock</th>
                        <th>Precio</th>
                    </tr>
                    ${
                        item.products.map(prod=> `
                        <tr>
                            <td>${prod.name}</td>
                            <td style="text-align: center">${prod.stock}</td>
                            <td>$${prod.price}</td>
                        </tr>
                        `).join('')
                    }
                    <tr>
                        <td></td>
                        <td style="text-align: right">Total: </td>
                        <th> $${item.products.reduce((total, p) => total + p.price, 0)}</th>
                    </tr>
                </table>
            `, process.env.ADMIN_MAIL)

            await asyncSendText(process.env.ADMIN_PHONE, `Nueva orden de compra
${(new Date()).toLocaleDateString()}
Nº Orden: ${item.id}
Usuario: ${user.username} - ${user.name}

PRODUCTOS:
${
item.products.map(prod=> `-- ${prod.name}
----stock: ${prod.stock}
----$${prod.price}
`).join('')
                }
TOTAL: $${item.products.reduce((total, p) => total + p.price, 0)}
             `, true);

            if(user.phone && user.phone.length === 10 && ['11', '15'].includes(user.phone.slice(0,2)) ) {
                await asyncSendText(user.phone, `
Gracias comprar con nosotros

Su orden Nº Orden ${item.id} esta siendo procesada, le responderemos lo mas pronto posible.

PRODUCTOS:
${
item.products.map(prod=> `-- ${prod.name}
----$${prod.price}
`).join('')
                }
TOTAL: $${item.products.reduce((total, p) => total + p.price, 0)}

Muchas gracias!!
            `, false);
            }
            return res.status(200).json({result: 'ok'})
        }
        return res.status(200).json({result: 'fail'})



        
    } catch (e) {
        return res.status(500).json({'message': 'no order', error: e})
    }
}