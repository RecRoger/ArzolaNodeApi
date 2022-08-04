import { Router } from 'express'
import { logout, passportAfterLogin, passportAfterSignup } from "../controllers/users.controller.js";
import passport from 'passport'

export const usersRouter = Router()

/** Formato de autenticacion Manual
 * 
 usersRouter.post('/login', login)
 usersRouter.post('/signup', signUp)
*/

// Autenticacion con Passport
usersRouter.post('/login', passport.authenticate('logIn'), passportAfterLogin)
usersRouter.post('/signup', passport.authenticate('signUp'), passportAfterSignup)
usersRouter.post('/logout', logout)
