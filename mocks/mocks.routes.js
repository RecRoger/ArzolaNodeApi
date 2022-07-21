import { Router } from 'express'
import { MockProductsList } from './products.mocks.js'

export const mocksRouter = Router()

mocksRouter.get('/mocks', (req, res) => {
    console.log('> Consultar mocks de products')
    const count = Number(req.query?.count) || 5
    let items = MockProductsList(count);
    return res.render('mocks', { products: items, count })
})