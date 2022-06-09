import express from 'express'
import { engine } from 'express-handlebars'
import { productsRouter } from './routes/products.routes.js'
// import { publicRouter } from './routes/public.routes.js';


import { FileManager } from "./fileManager.js";

const productFile = new FileManager('products');

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.engine('handlebars', engine())
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', async (req, res) => {
    console.log('> Consultar todos los elemento')
    let items = await productFile.getAll();
    return res.render('products', { products: items })
})
app.get('/new', async (req, res) => {
    return res.render('new')
})

app.get('/edit/:id', async (req, res) => {
    const id = Number(req.params.id)
    console.log('> Consultar elemento', id)
    let item = await productFile.getById(id);
    return res.render('edit', item)
})

// app.use('/oldForms', 'public')
app.use('/api/products', productsRouter)

app.listen(PORT, () => {
    console.log(`>> Server running on PORT: ${PORT}`)
});