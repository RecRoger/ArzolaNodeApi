import passport from 'passport'
import LocalStrategy from 'passport-local'
import { getUser, registerUser } from '../controllers/users.controller.js'
import {logger} from '../logger.js'

export const logedIn = (req, res, next) => {
    // Validacion Manual, ya no se usa
    // if(req.session?.username) {
    //     next();
    // } else {
    //     res.redirect('/login');
    // }

    if(req.isAuthenticated() ) return next();
    res.redirect('/login');

}


// Autenticacion con Passport
passport.use('logIn', new LocalStrategy({
        passReqToCallback: true,
    }, async function(req, pusername, ppassword, next) {
        logger.info('-- Se requiere autorizacion')
        const {username, password} = req.body
        let user = await getUser(username);
        if(user && (user.username === username || user.email === username) && user.password === password) {
            return next(null, user);
        } else {
            logger.error('> ERROR - usuario rechazado')
            return next(null, false)
        }
    })
    )
    
    passport.use('signUp', new LocalStrategy({
        passReqToCallback: true,
    }, async function(req, username, password, next) {
        
        const data = req.body
        const userUsername = await getUser(data.username)
        const userEmail = await getUser(data.email)
        
        if(userUsername || userEmail) {
            return next(null, false)
        }
        
        try {
            const newUser = await registerUser(data)
            return next(null, newUser);
        } catch (err) {
            logger.error('> ERROR - usuario rechazado')
            return next(null, false)
        }
    })
)
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});


