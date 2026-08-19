import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.json({ success: false, message: 'Not Authorized. Please login again.' })
        }

        const token = authHeader.split(' ')[1] 
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        // હવે આપણે .env નહિ, પણ ડેટાબેઝમાંથી આવેલું ID ચેક કરીશું
        if (!token_decode.id) {
            return res.json({ success: false, message: 'Invalid Admin Token' })
        }

        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
export default authAdmin