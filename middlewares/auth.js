export const logedIn = (req, res, next) => {
    if(req.session?.username) {
        next();
    } else {
        res.redirect('/login');
    }
}