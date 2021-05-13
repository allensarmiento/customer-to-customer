import express, { Request, Response } from 'express';
import { Routes } from '../common';
import { Item } from '../models/item';

const router = express.Router();

router.get(Routes.items, async (req: Request, res: Response) => {
  const items = await Item.find({ orderId: undefined });

  res.send(items);
});

export { router as indexItemRouter };
