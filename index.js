import express from 'express'
import { FileManager } from "./fileManager.js";

const app = express();
const PORT = 8080;
const productFile = new FileManager('products');

app.get('/products', async (req, res)=> {
    let items = await productFile.getAll();
    return res.status(200).json(items)
})

app.get('/randomProduct', async (req, res)=> {
    let item = await productFile.getById();
    return res.status(200).json(item)
})

app.listen(PORT, () => {
    console.log(`>> Server running on PORT: ${PORT}`)
});