import express from 'express'
import 'dotenv/config'
import { startIO } from './routes/chat.io.js';
import { engine } from 'express-handlebars'
import { productsRouter } from './routes/products.routes.js'
import { cartRouter } from './routes/cart.routes.js'
import { mocksRouter } from './mocks/mocks.routes.js'
import http  from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { dbCS, conectToDb } from './db/db.js'
import { usersRouter } from './routes/users.routes.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import mongoStore from 'connect-mongo'
import passport from 'passport'

import { logedIn } from './middlewares/auth.js'
import { getServerData } from './controllers/server-data.controller.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// server inicialization
const app = express();
const PORT = 8050;
const server = http.createServer(app);
startIO(server)

// Manejo de sesion
app.use(cookieParser());
app.use(session({
    // Manejo de sesion con MongoDb Manualmente
    // store: mongoStore.create({
    //     mongoUrl: dbCS,
    //     mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    //     ttl: 60,
    //     collectionName: 'sessions'
    // }),
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}))
app.use(passport.initialize())
app.use(passport.session())

// api middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

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
app.get('/info', getServerData)


// api routes
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/users', usersRouter)
app.use('/api/*',(req, res)=> {
    res.status(404).json({ error : -1, descripcion: 'ruta invalida' })
})

app.use('/*', (req, res)=> {
    res.sendFile(__dirname + '/public' + '/notFound.html')
})


// port server listening
server.listen(PORT, async () => {
    await conectToDb()
    console.log(`>> Server running on PORT: ${PORT}`)
});