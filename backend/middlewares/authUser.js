import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
  try {
    // Standard Authorization header check karo, jo na hoy to juna 'token' header par fallback karo
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : req.headers.token;

    if (!token) {
      return res.json({ success: false, message: 'Not Authorized. Please Login Again' })
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
    
    // User ID ne req.body ma attach kariye chiye jethi tamara controller barabar kaam kare
    req.body.userId = token_decode.id;

    next()

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Invalid or Expired Token' })
  }
}

export default authUser