import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must provide a name.'],
    trim: true,
    maxlength: [50, 'Name must have less than or equal to 50 characters'],
    minlength: [3, 'Name must have more than or equal to 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, //This data will not be sent to the client, it is hidden - Unless we use User.create - it will still be sent so BE CAREFUL!!
  },
  lastName: {
    type: String,
    required: [true, 'All users must provide a last name'],
    trim: true,
    maxlength: [30, 'Last name must have less than or equal to 30 characters'],
    default: 'Doe',
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Location must have less than or equal to 50 characters'],
    default: 'My city',
  },
});

UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths());

  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  //console.log(this); // Careful with this log - it sends the password to the console
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User = mongoose.model('User', UserSchema);

export default User;
