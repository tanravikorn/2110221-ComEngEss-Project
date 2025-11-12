import jwt from 'jsonwebtoken';

/** @type {import("express").RequestHandler} */
export const authMiddleware = (req, res, next) => {
  try {
    //get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'คุณไม่ได้ล็อคอินนะครับ อดนะ' });
    }

    //create token variable 
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'คุณมั่วนะค้าบบบ' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken.id; 

    next();

  } catch (error) {
    
    return res.status(401).json({ error: 'ไม่อนุญาตนะค้าบ' });
  }
};

