import express from 'express'
import { productsRouter } from './routes/products.routes.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(__dirname + '/public'))

app.get('/',  (req, res) => {
    res.sendFile('/index.html')
})

app.use('/api/products', productsRouter)

app.listen(PORT, () => {
    console.log(`>> Server running on PORT: ${PORT}`)
});