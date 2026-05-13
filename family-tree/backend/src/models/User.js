const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: ''
    },
    lastName: {
      type: String,
      trim: true,
      default: ''
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      default: null
    },
    password: {
      type: String,
      required: true
    },
    city: {
      type: String,
      trim: true,
      default: ''
    },
    kuldeviName: {
      type: String,
      trim: true,
      default: ''
    },
    surapura: {
      type: String,
      trim: true,
      default: ''
    },
    contactNumber: {
      type: String,
      trim: true,
      default: ''
    },
    profileCompleted: {
      type: Boolean,
      default: false
    },
    paymentDone: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
