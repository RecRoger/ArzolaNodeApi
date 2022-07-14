import express from 'express'
import { engine } from 'express-handlebars'
import { productsRouter } from './routes/products.routes.js'
import { cartRouter } from './routes/cart.routes.js'
import http  from 'http';
import { startIO } from './routes/chat.io.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import mongoose from 'mongoose'

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



server.listen(PORT, () => {
    conectToDb()
    console.log(`>> Server running on PORT: ${PORT}`)
});