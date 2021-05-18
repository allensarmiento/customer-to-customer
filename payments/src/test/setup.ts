import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { generateId } from '../utilities/generate-id';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock('../nats-wrapper');

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'aouehtns';
  process.env.EXPIRATION_WINDOW_SECONDS = '900';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  const jwtPayload = {
    id: id || generateId(),
    email: 'test@test.com',
  };

  const token = jwt.sign(jwtPayload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  // Encode the sessionJSON as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string that contains the cookie with the encoded data
  return [`express:sess=${base64}`];
};
