import express from 'express';
import { currentUser, Routes } from '../common';

const router = express.Router();

router.get(Routes.currentUser, currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
