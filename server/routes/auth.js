import express from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pantrychef_vintage_secret_ledger_key_987';
const AUTH_COOKIE = 'pantrychef_auth_token';
const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

// Helper to generate token
const generateToken = (user) => {
  const id = user._id || user.id;
  return jwt.sign(
    {
      id,
      email: user.email,
      name: user.name,
      chefTitle: user.chefTitle,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, chefTitle } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required chef credentials (name, email, password).',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password should be at least 6 characters long.',
      });
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'A chef with this email is already registered in the ledger.',
      });
    }

    const user = await UserRepository.create({
      name,
      email,
      password,
      chefTitle: chefTitle || 'Executive Home Chef',
    });

    const token = generateToken(user);
    res.cookie(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: ONE_YEAR,
      path: '/',
    });

    return res.status(201).json({
      success: true,
      message: `Welcome to the kitchen, Chef ${user.name}!`,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        chefTitle: user.chefTitle,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.',
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password.',
      });
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid chef credentials. No ledger account found.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const token = generateToken(user);
    res.cookie(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: ONE_YEAR,
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: `Welcome back, Chef ${user.name}!`,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        chefTitle: user.chefTitle,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.',
    });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.[AUTH_COOKIE];
    if (!token) {
      return res.status(200).json({
        success: true,
        isAuthenticated: false,
        user: {
          id: req.userId,
          name: 'Guest Cook',
          chefTitle: 'Pantry Explorer',
          isGuest: true,
        },
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await UserRepository.findById(decoded.id);

      if (!user) {
        return res.status(200).json({
          success: true,
          isAuthenticated: false,
          user: {
            id: req.userId,
            name: 'Guest Cook',
            chefTitle: 'Pantry Explorer',
            isGuest: true,
          },
        });
      }

      return res.status(200).json({
        success: true,
        isAuthenticated: true,
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          chefTitle: user.chefTitle,
          isGuest: false,
        },
      });
    } catch (err) {
      return res.status(200).json({
        success: true,
        isAuthenticated: false,
        user: {
          id: req.userId,
          name: 'Guest Cook',
          chefTitle: 'Pantry Explorer',
          isGuest: true,
        },
      });
    }
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return res.status(500).json({
      success: false,
      error: 'Could not fetch current session user.',
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie(AUTH_COOKIE, { path: '/' });
  return res.status(200).json({
    success: true,
    message: 'Chef signed out successfully.',
  });
});

export default router;
