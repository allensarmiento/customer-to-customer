import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, Routes, validateRequest } from '../common';
import { User } from '../models/user';

const router = express.Router();

router.post(
  Routes.signup,
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email }).exec();

      if (existingUser) {
        throw new BadRequestError('Email in use');
      }

      const user = User.build({ email, password });
      await user.save();

      // Generate JWT
      const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
      }, process.env.JWT_KEY!);

      // Store it on session object
      req.session = { jwt: userJwt };

      res.status(201).send(user);
    } catch (err) {
      throw new BadRequestError('Somthing went wrong');
    }
  },
);

export { router as signupRouter };
