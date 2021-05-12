import express from 'express';
import { Routes } from '../common';

const router = express.Router();

router.get(Routes.signout, (req, res) => {
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
