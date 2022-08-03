import passport from 'passport'
import LocalStrategy from 'passport-local'
import { getUser, registerUser } from '../controllers/users.controller.js'

export const logedIn = (req, res, next) => {
    if(req.session?.username) {
        next();
    } else {
        res.redirect('/login');
    }
}


// Autenticacion con Passport
passport.use('logIn', new LocalStrategy({
        passReqToCallback: true,
    }, async function(req, pusername, ppassword, next) {
        const {username, password} = req.body
        let user = await getUser(username);
        if(user && user.username === username && user.password === password) {
            return next(null, user);
        } else {
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


