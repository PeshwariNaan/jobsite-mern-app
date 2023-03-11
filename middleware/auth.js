import jwt from 'jsonwebtoken';
import { UnathenticatedError } from '../errors/index.js';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnathenticatedError('Authentication invalid!');
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(payload);
    // req.user = payload;
    const testUser = payload.userId === '640877e3f4a33a978855ebf4';
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new UnathenticatedError('Authentication invalid!');
  }
};

export default auth;
