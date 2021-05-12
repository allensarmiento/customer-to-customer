import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, Routes, validateRequest } from '../common';
import { User } from '../models/user';
import { PasswordManager } from '../services/password-manager';

const router = express.Router();

router.post(
  Routes.signin,
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').notEmpty().withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }).exec();

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await PasswordManager.compare(
      existingUser.password,
      password,
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email,
    }, process.env.JWT_KEY!);

    // Store it on session object
    req.session = { jwt: userJwt };

    res.status(201).send(existingUser);
  },
);

export { router as signinRouter };
