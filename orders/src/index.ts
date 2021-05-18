import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { app } from './app';
import {
  ExpirationCompleteListener,
} from './events/listeners/expiration-complete-listener';
import { ItemCreatedListener } from './events/listeners/item-created-listener';
import { ItemUpdatedListener } from './events/listeners/item-updated-listener';
import {
  PaymentCreatedListener,
} from './events/listeners/payment-created-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  if (!process.env.EXPIRATION_WINDOW_SECONDS) {
    throw new Error('EXPIRATION_WINDOWS_SECONDS must be defined');
  }

  if (isNaN(Number(process.env.EXPIRATION_WINDOW_SECONDS))) {
    throw new Error('EXPIRATION_WINDOWS_SECONDS is invalid');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ExpirationCompleteListener(natsWrapper.client).listen();
    new ItemCreatedListener(natsWrapper.client).listen();
    new ItemUpdatedListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
