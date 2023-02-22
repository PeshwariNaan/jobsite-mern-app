import { StatusCodes } from 'http-status-codes';
import User from '../models/userModel.js';
import { BadRequestError } from '../errors/index.js';

const register = async (req, res) => {
  // We are not using try catch blocks but rather the npm express-async-errors package - No need to use next
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all values.');
  }
  const user = await User.create({ name, email, password });
  res.status(StatusCodes.CREATED).json({ user });
};

const login = (req, res) => {
  res.send('login user');
};

const updateUser = (req, res) => {
  res.send('updateUser user');
};

export { register, login, updateUser };
