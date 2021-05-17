import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  Routes,
} from '../common';
import { Order } from '../models/order'

const router = express.Router();

router.get(
  `${Routes.orders}/:orderId`,
  requireAuth,
  async (req: Request, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      throw new NotFoundError();
    }

    const order = await Order.findById(req.params.orderId).populate('item');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  },
);

export { router as showOrderRouter };
