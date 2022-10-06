import { usersCollection } from '../models/users.model.js'
import { logger } from '../commons/logger.js'
import {saveFile, asyncSendMail} from '../commons/utils.js'

export const getUser = async (username) => {
    logger.info('> Consultando si usuario ', username , ' existe ')
    try {
        const users = await usersCollection.findOne({
            $or: [
                {username: username},
                {email: username}
            ]
        })
        return users
    } catch(e) {
        logger.error('> ERROR', e)
        return null
    }
}
export const registerUser = async (user) => {
    const { email, username } = user
    logger.info('> Registrando usuario ', email, username)
    try {
        let filePath = '';
        if(user.image) {
            const fileName = `${username}`;
            filePath = saveFile(user.image, fileName, 'users');
        }

        let newUser = await usersCollection.insertMany([{...user, image: filePath, role: 'client', signUpDate: new Date()}]);
        await asyncSendMail('Nuevo Registro', `
            <h3>Nuevo usuario</h3>
            <ul>
                <li>
                    <b>Nombre: </b>
                        ${user.name}
                    </div>
                </li>
                <li>
                    <b>Email: </b>
                        ${user.email}
                    </div>
                </li>
                <li>
                    <b>Usuario: </b>
                        ${user.username}
                    </div>
                </li>
                <li>
                    <b>Telefono: </b>
                        ${user.phone}
                    </div>
                </li>
                <li>
                    <b>Direccion: </b>
                        ${user.address}
                    </div>
                </li>
            </ul>
        `, process.env.ADMIN_MAIL)
        return newUser[0]
    } catch(e) {
        logger.error('> ERROR', e)
        return null
    }
}

// Autenticacion a Mano, ya no se usa
/* export const login =  async (req, res) => {
    const {username, password} = req.body
    logger.info('> Login de usuario ', username)
    let tiempo = parseInt(req.query.tiempo) || 60000;
    
    try {
        const user = await getUser(username)
        if (user) {
            req.session.username = username;
            return res.status(200).cookie('chSession', username, {maxAge: tiempo}).json({login: true})
        } else {
            logger.error('> usuario inexistente')
            return res.status(200).json({login: false, message: "No user", error: "no user"})
        }
        
    } catch (e) {
        return res.status(400).json({login: false, message: "No session", error: e})
    }
    
} */
export const passportAfterLogin = async (req, res) => {
    try {
        let tiempo = parseInt(req.query.tiempo) || 60000;
        const user = req.session.passport.user
        return res.status(200).cookie('chSession', user.id, {maxAge: tiempo}).json({login: true})
    } catch(e) {
        return res.status(400).json({login: false, message: "No session", error: e})
    }
}

// Registro a Mano, ya no se usa
/* export const signUp =  async (req, res) => {
    const data = req.body
    logger.info('> registro de usuario', data.username)
    
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
} */
export const passportAfterSignup = async (req, res) => {
    try {
        // const user = await getUser(req.body.username)
        logger.info('> signUp exitoso')
        return res.status(200).json({signin: true})
    } catch(e) {
        return res.status(400).json({login: false, message: "No session", error: e})
    }
}

export const getUserData = async (req,res) => {
    const id = req.params.id
    logger.info('> Consultando datos de usuario:', id)

    let items = await usersCollection.findOne({_id: id}, { 
        password: 0,
    });
    return res.status(200).json(items)
}

export const logout = async (req, res) => {
    logger.info('> Logout de usuario ', req?.session?.passport?.user?.username)
    // Eliminacion Manual de la session
    /* try {
        logger.info('> Logout de usuario ', req.session.username)
        req.session.destroy()
        return res.clearCookie('chSession').status(200).json({login: false})
        
    } catch (e) {
        return res.status(400).json({login: true, message: "No session", error: e})
    } */
    req.session.destroy( e => {
        if(e) return res.status(400).json({login: true, message: "No session", error: e});
        return res.clearCookie('chSession').status(200).json({login: false})
    })
}