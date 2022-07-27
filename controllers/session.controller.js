let usuarios = []


export const login =  async (req, res) => {
    const {username, password} = req.body
    console.log('> Login de usuario ', username)
    let tiempo = parseInt(req.query.tiempo) || 60000;

    try {
        usuarios.push(username)

        req.session.username = username;
        return res.status(200).cookie('chSession', username, {maxAge: tiempo}).json({login: true})

    } catch (e) {
        return res.status(200).json({login: false, message: "No session", error: e})
    }

}

// export const registerUser =  async (req, res) => {
//     const data = req.body
//     console.log('> registro de usuario')
    
//     if(!data?.name) {
//         return res.status(400).json({error: "No Item"})
//     }

//     try {
//         return res.status(200).json(newId[0] || {error: "No Item"})
        
//     } catch (err) {
//         return res.status(404).json({'error': err})
//     }
// }

export const logout = async (req, res) => {
    console.log('> Logout de usuario ', req.session.username)

    try {
        req.session.destroy()
        return res.clearCookie('chSession').status(200).json({login: false})

    } catch (e) {
        return res.status(200).json({login: true, message: "No session", error: e})
    }
}