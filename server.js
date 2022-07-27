import express from 'express'
import { startIO } from './routes/chat.io.js';
import { engine } from 'express-handlebars'
import { productsRouter } from './routes/products.routes.js'
import { cartRouter } from './routes/cart.routes.js'
import { mocksRouter } from './mocks/mocks.routes.js'
import http  from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { dbCS, conectToDb } from './db/db.js'
import { sessionRouter } from './routes/session.routes.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import mongoStore from 'connect-mongo'

import { logedIn } from './middlewares/auth.js'

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


// Manejo de sesion
app.use(cookieParser());
app.use(session({
    store: mongoStore.create({
        mongoUrl: dbCS,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 60,
        collectionName: 'sessions'
    }),
    secret: 'sessionSecretKey',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}))


// public views routes
app.get('/',  (req, res) => { res.sendFile('/index.html') })
app.get('/chat',  (req, res) => { res.sendFile(__dirname + '/public' + '/chat.html') })
app.get('/products',  logedIn, (req, res) => { res.sendFile(__dirname + '/public' + '/products.html') })
app.get('/login',  (req, res) => { res.sendFile(__dirname + '/public' + '/login.html') })


// mock views
app.engine('handlebars', engine())
app.set('view engine', 'handlebars');
app.set('views', './views');
app.get('/mocks', mocksRouter)


// api routes
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/session', sessionRouter)
app.use('/api/*',(req, res)=> {
    res.status(404).json({ error : -1, descripcion: 'ruta invalida' })
})

app.use('/*', (req, res)=> {
    res.sendFile(__dirname + '/public' + '/notFound.html')
})





// port server listening
server.listen(PORT, () => {
    conectToDb()
    console.log(`>> Server running on PORT: ${PORT}`)
});