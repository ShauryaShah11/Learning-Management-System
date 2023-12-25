import dotenv from 'dotenv';
import path  from 'path';
import { fileURLToPath } from 'url';

const checkAccess = (req, res, next) => {
    if (req.user.role === 'admin') { 
      next();
    } else {
      return res.status(403).json({ error: 'Access forbidden' });
    }
};


export {checkAccess}
  
  
  