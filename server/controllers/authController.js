// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role, 
      isVerified: user.isVerified,
      name: user.name,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'employee',
    });

    await user.save();
    res.status(201).json({ message: 'Registered successfully. Await verification by manager.' });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = createToken(user);
    
    res.json({ 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.verifyUser = async (req, res) => {
  const { userId } = req.params;

  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Only manager can verify users' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId, 
      { isVerified: true },
      { new: true }
    );
    res.json({ message: 'User verified successfully', user });
  } catch (err) {
    res.status(400).json({ error: 'Verification failed' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};



