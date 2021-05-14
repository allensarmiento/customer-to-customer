import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from './common';
import { indexItemRouter } from './routes/index';
import { createItemRouter } from './routes/new';
import { showItemRouter } from './routes/show';
import { updateItemRouter } from './routes/update';

const app = express();
app.set('trust proxy',true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);
app.use(currentUser);

app.use(indexItemRouter);
app.use(createItemRouter);
app.use(showItemRouter);
app.use(updateItemRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
