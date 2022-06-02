import { Router } from 'express'
import { FileManager } from "../fileManager.js";

const productFile = new FileManager('products');
export const productsRouter = Router()

productsRouter.get('/:id', async (req, res) => {
    const id = Number(req.params.id)
    console.log('> Consultar elemento', id)
    let item = await productFile.getById(id);
    return res.status(200).json(item || {error: "No Item"})
})

// productsRouter.put('/:id', async (req, res) => {
productsRouter.post('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const data = req.body
    console.log('> Actualizar elemento', id, data)
    let item = await productFile.update(id, data);
    return res.status(200).json(item)
})

// productsRouter.delete('/:id', async (req, res) => {
productsRouter.post('/delete/:id', async (req, res) => {
    const id = Number(req.params.id)
    console.log('> Eliminar elemento', id)
    try {
        let edition = await productFile.deleteById(id);

        return res.status(200).json({id, msg: 'Deleted'})
    } catch (err) {
        return res.status(404).json({'error': err})
    }
})

productsRouter.get('/', async (req, res) => {
    console.log('> Consultar todos los elemento')
    let items = await productFile.getAll();
    return res.status(200).json(items)
})

productsRouter.post('/', async (req, res) => {
    const data = req.body

    console.log('> Añadir elemento', data)
    
    if(!data?.title) {
        return res.status(400).json({error: "No Item"})
    }

    let newId = await productFile.save(data);
    return res.status(200).json(newId && {id: newId, ...data} || {error: "No Item"})
})
