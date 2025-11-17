import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const SALT_ROUNDS = 12;

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw createError('Email already registered', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );

    const user = result.rows[0];

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw createError('JWT secret not configured', 500);
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '24h' });

    logger.info(`User signed up: ${email}`);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const result = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      throw createError('Invalid email or password', 401);
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw createError('Invalid email or password', 401);
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw createError('JWT secret not configured', 500);
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '24h' });

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};
