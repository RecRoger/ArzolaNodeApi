import express from 'express'
import { engine } from 'express-handlebars'
import { productsRouter } from './routes/products.routes.js'
import { cartRouter } from './routes/cart.routes.js'
import { mocksRouter } from './mocks/mocks.routes.js'
import http  from 'http';
import { startIO } from './routes/chat.io.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import mongoose from 'mongoose'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// server inicialization
const app = express();
const PORT = 8080;
const server = http.createServer(app);
startIO(server)

// api middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

// public views routes
app.get('/',  (req, res) => {
    res.sendFile('/index.html')
})
app.get('/chat',  (req, res) => {
    res.sendFile(__dirname + '/public' + '/chat.html')
})
app.get('/products',  (req, res) => {
    res.sendFile(__dirname + '/public' + '/products.html')
})

// mock views
app.engine('handlebars', engine())
app.set('view engine', 'handlebars');
app.set('views', './views');
app.get('/mocks', mocksRouter)

// api routes
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/*',(req, res)=> {
    res.status(404).json({ error : -1, descripcion: 'ruta invalida' })
})

app.use('/*', (req, res)=> {
    res.sendFile(__dirname + '/public' + '/notFound.html')
})


// DB config
async function conectToDb() {
    let dbuser = 'MongoNodeApp'
    let dbpass = 'Coderhouse'
    let dbCS = `mongodb+srv://${dbuser}:${dbpass}@coderhousenodecluster.gabnc.mongodb.net/Coderhouse?retryWrites=true&w=majority`

    try {
        await mongoose.connect(dbCS)
        console.log('> db conected succesfully!')
    } catch (e) {
        throw e
    }
}


// port server listening
server.listen(PORT, () => {
    conectToDb()
    console.log(`>> Server running on PORT: ${PORT}`)
});