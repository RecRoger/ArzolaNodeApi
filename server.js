import express from 'express'
import 'dotenv/config'
import { startIO } from './src/routes/chat.io.js';
import { engine } from 'express-handlebars'
import { productsRouter } from './src/routes/products.routes.js'
import { cartRouter } from './src/routes/cart.routes.js'
import { mocksRouter } from './src/mocks/mocks.routes.js'
import http  from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { dbCS, conectToDb } from './src/db/db.js'
import { usersRouter } from './src/routes/users.routes.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import mongoStore from 'connect-mongo'
import passport from 'passport'
import {logger} from './src/commons/logger.js'
import path from 'path';
import { logedIn } from './src/middlewares/auth.js'
import { getServerData } from './src/controllers/server-data.controller.js'

import cluster from 'cluster';
import os from 'os'

import compression from 'compression'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// server inicialization
const app = express();
const PORT = process.argv[2] || process.env.PORT || 8080
const server = http.createServer(app);
startIO(server)

// Cluster && Furk
const numCpus = os?.cpus()?.length
if('CLUSTER' === process.argv[3] && cluster.isPrimary) {
    logger.info("numCpus: ", numCpus);
    for (let i = 0; i < numCpus; i++) {
        cluster.fork();
    }
    cluster.on('exit', worker => {
        logger.info(`Worker: ${worker.process.id} died`);
        cluster.fork();
    });


} else {

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
    app.use(express.json({limit: '50mb'}))
    app.use(express.urlencoded({extended: true,limit: '50mb'}))
    app.use(express.static(__dirname + '/public'))

    app.get(
        '/uploads/users/:file',
        function (req, res) {
            const img = req.params.file;
            const filePath = `./uploads/users/${img}`;
            const file = path.resolve(__dirname, filePath);
            // No need for special headers
            res.download(file);
        },
    );

    

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
    app.get('/infozip', compression(), getServerData)


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
        logger.info(`>> Server running on PORT: ${PORT}`)
        logger.info(`>> Process ID: ${process.pid}`)
    });


}

