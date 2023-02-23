import { StatusCodes } from 'http-status-codes';
import User from '../models/userModel.js';
import { BadRequestError } from '../errors/index.js';

const register = async (req, res) => {
  // We are not using try catch blocks but rather the npm express-async-errors package - No need to use next
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all values.');
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Sorry. This email is already in use.');
  }
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    //Here we hardcoded the values that we want on the response. We did this to avoid getting the PW back because it will be sent with .create method
    user: {
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
    },
    token,
  });
};

const login = (req, res) => {
  res.send('login user');
};

const updateUser = (req, res) => {
  res.send('updateUser user');
};

export { register, login, updateUser };
