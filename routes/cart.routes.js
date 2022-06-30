import { Router } from 'express'
import { CreateCart,
    GetCart,
    AddToCart,
    RemoveFromCar,
    FlushCart } from "../controllers/cart.controller.js";

export const cartRouter = Router()


cartRouter.post('/', CreateCart)

cartRouter.get('/:id', GetCart)

cartRouter.post('/:id/products', AddToCart)

cartRouter.delete('/:id/products/:productId',  RemoveFromCar)

cartRouter.delete('/:id', FlushCart)
