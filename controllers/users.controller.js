import { usersCollection } from '../models/users.model.js'

export const getUser = async (username) => {
    console.log('> Consultando usuario ', username)
    try {
        const users = await usersCollection.findOne({
            $or: [
                {username: username},
                {email: username}
            ]
        })
        return users
    } catch(e) {
        console.log('> ERROR', e)
        return null
    }
}
export const registerUser = async (user) => {
    const { email, username } = user
    console.log('> Registrando usuario ', email, username)
    try {
        let newUser = await usersCollection.insertMany([{...user, signUpDate: new Date()}]);
        return newUser
    } catch(e) {
        console.log('> ERROR', e)
        return null
    }
}

export const login =  async (req, res) => {
    const {username, password} = req.body
    console.log('> Login de usuario ', username)
    let tiempo = parseInt(req.query.tiempo) || 60000;
    
    try {
        const user = await getUser(username)
        if (user) {
            req.session.username = username;
            return res.status(200).cookie('chSession', username, {maxAge: tiempo}).json({login: true})
        } else {
            console.log('> usuario inexistente')
            return res.status(200).json({login: false, message: "No user", error: "no user"})
        }
        
    } catch (e) {
        return res.status(400).json({login: false, message: "No session", error: e})
    }
    
}
export const passportAfterLogin = async (req, res) => {
    try {
        let tiempo = parseInt(req.query.tiempo) || 60000;
        return res.status(200).cookie('chSession', req.body.name, {maxAge: tiempo}).json({login: true})
    } catch(e) {
        return res.status(400).json({login: false, message: "No session", error: e})
    }
}
export const signUp =  async (req, res) => {
    const data = req.body
    console.log('> registro de usuario', data.username)
    
    const userUsername = await getUser(data.username)
    const userEmail = await getUser(data.email)

    if(userUsername || userEmail) {
        return res.status(400).json({error: 'duplicated', message: ((userUsername && 'Usuario') || (userEmail && 'Correo'))+ " existente"})
    }

    try {
        const newUser = await registerUser(data)
        return res.status(200).json(newUser || {error: "No User"})
        
    } catch (err) {
        return res.status(404).json({'error': err})
    }
}
export const passportAfterSignup = async (req, res) => {
    try {
        const user = await getUser(req.body.username)
        console.log('> signUp exitoso')
        return res.status(200).json({signin: true})
    } catch(e) {
        return res.status(400).json({login: false, message: "No session", error: e})
    }
}

export const logout = async (req, res) => {
    console.log('> Logout de usuario ', req.session.username)

    try {
        req.session.destroy()
        return res.clearCookie('chSession').status(200).json({login: false})

    } catch (e) {
        return res.status(400).json({login: true, message: "No session", error: e})
    }
}