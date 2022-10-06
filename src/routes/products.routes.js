import { Router } from 'express'
import { GetAllProducts, GetOneProduct, UpdateProduct, DeleteProduct, CreateProduct } from "../controllers/products.controller.js";
export const productsRouter = Router()


productsRouter.get('/', GetAllProducts)

productsRouter.get('/:id', GetOneProduct)

productsRouter.post('/:id', UpdateProduct)

productsRouter.delete('/:id', DeleteProduct )

productsRouter.post('/', CreateProduct)
