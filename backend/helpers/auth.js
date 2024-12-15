import jwt from 'jsonwebtoken'

const { sign, verify } = jwt

// Middleware to check if user is authenticated and create a new token
const auth = (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized' })
    try {
        const authHeader = req.headers.authorization
        const accessToken = authHeader.split(' ')[1]

        const decodedUser = verify(accessToken, process.env.JWT_SECRET_KEY)
        const newAccessToken = sign({ username: decodedUser.username }, process.env.JWT_SECRET_KEY, { expiresIn: '12h' })

        res.header('Access-Control-Expose-Headers', 'Authorization')
        res.header('Authorization', 'Bearer ' + newAccessToken)
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

export { auth }