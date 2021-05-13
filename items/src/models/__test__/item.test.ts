import { Item } from '../item';

it('implements optimistic concurrency control', async (done) => {
  const item = await Item.build({
    title: 'Art piece',
    price: 30,
    userId: '123',
  });

  await item.save();

  const firstInstance = await Item.findById(item.id);
  const secondInstance = await Item.findById(item.id);

  // Make two separate changes to the items we fetched
  firstInstance!.set({ price: 40 });
  secondInstance!.set({ price: 50 });

  // Save the first fetched item
  await firstInstance!.save();

  // Attempt to save the second fetched item. An error is expected. Try/catch 
  // is used because jest's throw does not work with async typescript.
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const item = Item.build({
    title: 'Art piece',
    price: 30,
    userId: '123',
  });

  await item.save();
  expect(item.version).toEqual(0);

  await item.save();
  expect(item.version).toEqual(1);

  await item.save();
  expect(item.version).toEqual(2);
});
