import { Router } from 'express'
import { login, logout } from "../controllers/session.controller.js";
export const sessionRouter = Router()

sessionRouter.post('/login', login)

sessionRouter.post('/logout', logout)
