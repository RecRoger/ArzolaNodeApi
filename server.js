import express from 'express'
import { engine } from 'express-handlebars'
import { productsRouter, productFile } from './routes/products.routes.js'
import http  from 'http';
import { startIO } from './routes/chat.io.js';

const app = express();
const PORT = 8080;
const server = http.createServer(app);
startIO(server)

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

app.get('/chat', async (req, res) => {
    return res.render('chat')
})
app.use('/products', productsRouter)

server.listen(PORT, () => {
    console.log(`>> Server running on PORT: ${PORT}`)
});