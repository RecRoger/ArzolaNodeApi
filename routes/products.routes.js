import { Router } from 'express'
import { FileManager } from "../fileManager.js";


export class ProductData {
    constructor(title, price, thumbnail) {
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
    }
}

const defaultProducts = [
    new ProductData ('Pelotas', 350, 'https://upload.wikimedia.org/wikipedia/commons/4/48/Basketball.jpeg'),
    new ProductData ('Malla de Volleyball', 530.75, 'https://us.123rf.com/450wm/npaveln/npaveln1603/npaveln160300021/53521768-volley-ball-illustration-net-.jpg'),
    new ProductData ('Baston de Jockey', 245, 'https://m.media-amazon.com/images/I/317KUxBbizL.jpg'),
    new ProductData ('Raqueta de Tenis', 280.50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1h3bJLhziWwoFVIKOC3K_YS4h7xdWSlSgY_-poGlM3JkvushXW_snhiYcJ7K1LPHWZLc&usqp=CAU'),
    new ProductData ('Tabla de surf', 725, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7WkgTCIfOybKveA2-S5tgVEK2f4RqqjbUqoHNR8UeGuzPxu6WG8VlIrdMDq__NaTuWbo&usqp=CAU')
].map((prod, index) => ({id: index+1, ...prod}))

export const productFile = new FileManager('products', defaultProducts);
export const productsRouter = Router()



// RENDER VIEWS
productsRouter.get('/', async (req, res) => {
    console.log('> Consultar todos los elemento')
    let items = await productFile.getAll();
    // return res.status(200).json(items)
    return res.render('products', { products: items })
})

productsRouter.get('/new', async (req, res) => {
    return res.render('new')
})

productsRouter.get('/edit/:id', async (req, res) => {
    const id = Number(req.params.id)
    console.log('> Consultar elemento', id)
    let item = await productFile.getById(id);
    return res.render('edit', item)
})



productsRouter.get('/:id', async (req, res) => {
    const id = Number(req.params.id)
    console.log('> Consultar elemento get', id)
    let item = await productFile.getById(id);
    return res.status(200).json(item || {error: "No Item"})
})

// productsRouter.put('/:id', async (req, res) => {
productsRouter.post('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const data = req.body
    console.log('> Actualizar elemento', id, data)
    let item = await productFile.update(id, data);
    // return res.status(200).json(item)
    let items = await productFile.getAll();
    return res.render('products', { products: items })
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
productsRouter.get('/delete/:id', async (req, res) => {
    const id = Number(req.params.id)
    console.log('> Eliminar elemento', id)
    try {
        let edition = await productFile.deleteById(id);
        let items = await productFile.getAll();
        return res.render('products', { products: items })
    } catch (err) {
        return res.status(404).json({'error': err})
    }
})

productsRouter.post('/', async (req, res) => {
    const data = req.body

    console.log('> Añadir elemento', data)
    
    if(!data?.title) {
        return res.status(400).json({error: "No Item"})
    }

    let newId = await productFile.save(data);
    // return res.status(200).json(newId && {id: newId, ...data} || {error: "No Item"})
    
    let items = await productFile.getAll();
    return res.render('products', { products: items })
})
