import express from 'express'
import { engine } from 'express-handlebars'
import { productsRouter } from './routes/products.routes.js'
import { cartRouter } from './routes/cart.routes.js'
import http  from 'http';
import { startIO } from './routes/chat.io.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;
const server = http.createServer(app);
startIO(server)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(__dirname + '/public'))

app.get('/',  (req, res) => {
    res.sendFile('/index.html')
})
app.get('/chat',  (req, res) => {
    res.sendFile(__dirname + '/public' + '/chat.html')
})
app.get('/products',  (req, res) => {
    res.sendFile(__dirname + '/public' + '/products.html')
})
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/*',(req, res)=> {
    res.status(404).json({ error : -1, descripcion: 'ruta invalida' })
})

app.use('/*', (req, res)=> {
    res.sendFile(__dirname + '/public' + '/notFound.html')
})


// app.engine('handlebars', engine())
// app.set('view engine', 'handlebars');
// app.set('views', './views');
// app.get('/', async (req, res) => {
//     console.log('> Consultar todos los elemento')
//     let items = await productFile.getAll();
//     return res.render('products', { products: items })
// })

// app.get('/chat', async (req, res) => {
//     return res.render('chat')
// })

server.listen(PORT, () => {
    console.log(`>> Server running on PORT: ${PORT}`)
});