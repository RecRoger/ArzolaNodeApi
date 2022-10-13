import { productsCollection } from '../models/products.model.js'
import { logger } from '../commons/logger.js'


export async function getAllProducts() {
    logger.info('> Consultar todos los elemento')
    try {
        let items = await productsCollection.find({}, { 
            _id: 0,
            _v: 0,
        });
        return items
    } catch (e){
        return {msg: 'ERROR', error: e}
        // throw e
    }
}

export async function getOneProduct({ id }) {
    logger.info('> Consultar elemento get', id)

    try {
        let items = await productsCollection.find({id: id}, { 
            _id: 0,
            _v: 0,
        });
        return items[0]

    } catch (e) {
        return {error: "No Item", e}
    }
}

export async function updateProduct({id, data}) {
    logger.info('> Actualizar elemento', id, data)
    
    try {
        let edition = await productsCollection.updateOne({id: id}, { 
            $set: data
        });
        if (edition.acknowledged) {
            let items = await productsCollection.find({id: id}, { 
                _id: 0,
                _v: 0,
            });
            return items[0]
        }
        return {error: "No Item"}

    } catch (e) {
        return {error: "No Item", e}
    }
}
export async function deleteProduct({id}){
    logger.info('> Eliminar elemento', id)
    try {
        let edition = await productsCollection.deleteOne({id: id});
        
        return (edition.acknowledged && { id, msg: 'Deleted'}) || {'error': 'no delete'}
    } catch (err) {
        return {'error': err}
    }
}

export async function createProduct({ data }) {
    logger.info('> Añadir elemento', data.name)
    
    if(!data?.name) {
        return {error: "No Item"}
    }

    try {
        const id = await productsCollection.count()
        let newId = await productsCollection.insertMany([{id: (id +1).toString() , ...data, timestamp: new Date()}]);

        return newId[0] || {error: "No Item"}
    } catch (err) {
        return {'error': err}
    }
}