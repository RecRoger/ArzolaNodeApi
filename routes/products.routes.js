import { Router } from 'express'
import { FileManager } from "../db/fileManager.js";


export class ProductData {
    constructor(name, description, price, stock, thumbnail) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.thumbnail = thumbnail;
        this.timestamp = Date.now()
    }
}

const defaultProducts = [
    new ProductData ('Pelotas', 'Balon perfecto para jugar todo tipo de juegos', 350, 100, 'https://upload.wikimedia.org/wikipedia/commons/4/48/Basketball.jpeg'),
    new ProductData ('Malla de Volleyball', 'Red de Voleyboll para jugar en parque con los amigos',530.75, 50, 'https://us.123rf.com/450wm/npaveln/npaveln1603/npaveln160300021/53521768-volley-ball-illustration-net-.jpg'),
    new ProductData ('Baston de Hockey', 'Baston de hockey, perfecto para hielo o cesped', 245, 80, 'https://m.media-amazon.com/images/I/317KUxBbizL.jpg'),
    new ProductData ('Raqueta de Tenis', 'Raqueta de tenis profesional para iniciar en el deporte', 280.50, 65, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1h3bJLhziWwoFVIKOC3K_YS4h7xdWSlSgY_-poGlM3JkvushXW_snhiYcJ7K1LPHWZLc&usqp=CAU'),
    new ProductData ('Tabla de surf', 'Tabla de surf para amantes de los deportes extremos', 725, 40, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7WkgTCIfOybKveA2-S5tgVEK2f4RqqjbUqoHNR8UeGuzPxu6WG8VlIrdMDq__NaTuWbo&usqp=CAU')
].map((prod, index) => ({id: index+1, ...prod}))

export const productFile = new FileManager('products', defaultProducts);
export const productsRouter = Router()


productsRouter.get('/', async (req, res) => {
    console.log('> Consultar todos los elemento')
    let items = await productFile.getAll();
    return res.status(200).json(items.map(item=> ({
        id: item.id, name: item.name, price: item.price, thumbnail: item.thumbnail
    })))
})

productsRouter.get('/:id', async (req, res) => {
    const id = Number(req.params.id)
    console.log('> Consultar elemento get', id)
    let item = await productFile.getById(id);
    return res.status(200).json(item || {error: "No Item"})
})

productsRouter.post('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const data = req.body
    console.log('> Actualizar elemento', id, data)
    let item = await productFile.update(id, data);
    return res.status(200).json(item)
})

productsRouter.delete('/:id', async (req, res) => {
    const id = Number(req.params.id)
    console.log('> Eliminar elemento', id)
    try {
        let edition = await productFile.deleteById(id);
        return res.status(200).json((edition && {id, msg: 'Deleted'}) || {'error': 'no delete'})
    } catch (err) {
        return res.status(404).json({'error': err})
    }
})

productsRouter.post('/', async (req, res) => {
    const data = req.body
    console.log('> Añadir elemento', data)
    
    if(!data?.name) {
        return res.status(400).json({error: "No Item"})
    }
    let newId = await productFile.save(data);
    return res.status(200).json(newId && {id: newId, ...data} || {error: "No Item"})
})
