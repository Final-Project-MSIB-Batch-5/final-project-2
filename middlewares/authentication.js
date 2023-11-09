const { User } = require('../models')
const { verifyToken } = require('../helpers/jwt')

function authentication(req, res, next) {
    try {
        const token = req.get("token")
        const userDecoded = verifyToken(token)
        User.findOne({
            where: {
                id: userDecoded.id,
                email: userDecoded.email
            }
        })
            .then(user => {
                if (!user) {
                    return res.status(401).json({
                        name: "Authentication Error",
                        devMassage: `User with id ${userDecoded.id} not found in database`
                    })
                }
                res.locals.user = user
                return next()
            })
            .catch(err => {
                return res.status(401).json({
                    name: "Authentication Error",
                    devMassage: err
                })
            })
    }
    catch (err) {
        return res.status(401).json({
            name: "Authentication Error",
            devMassage: err
        })
    }
}

module.exports = authentication
