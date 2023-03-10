import { StatusCodes } from 'http-status-codes';
import User from '../models/userModel.js';
import { BadRequestError, UnathenticatedError } from '../errors/index.js';
import attachCookie from '../utils/attachCookie.js';

//REGISTER CONTROLLER
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
  attachCookie({ res, token });
  res.status(StatusCodes.CREATED).json({
    //Here we hardcoded the values that we want on the response. We did this to avoid getting the PW back because it will be sent with .create method
    user: {
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
    },
  });
};

//LOGIN CONTROLLER
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide all values.');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnathenticatedError('Invalid credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnathenticatedError('Invalid credentials');
  }
  const token = user.createJWT();
  user.password = undefined;
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please Provide all values.');
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save(); // user.save() can cause issues
  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const logoutUser = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'User logged out.' });
};

export { register, login, updateUser, getCurrentUser, logoutUser };
