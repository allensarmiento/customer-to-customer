import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  Routes,
  validateRequest,
} from '../common';
import {
  ItemUpdatedPublisher,
} from '../events/publishers/item-updated-publisher';
import { Item } from '../models/item';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  `${Routes.items}/:id`,
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
      throw new NotFoundError();
    }

    if (item.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if (item.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    item.set({
      title: req.body.title,
      price: req.body.price,
    });

    await item.save();

    // Not using await because it isn't necessary for the user to know the
    // event is published successfully.
    new ItemUpdatedPublisher(natsWrapper.client).publish({
      id: item.id,
      title: item.title,
      price: item.price,
      userId: item.userId,
      version: item.version,
    });

    res.send(item);
  },
);

export { router as updateItemRouter };
