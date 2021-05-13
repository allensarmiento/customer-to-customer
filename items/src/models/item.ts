import assert from 'assert';
import mongoose, { ClientSession } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ItemAttrs {
  title: string;
  price: number;
  userId: string;
}

interface ItemDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface ItemModel extends mongoose.Model<ItemDoc> {
  build(attrs: ItemAttrs): ItemDoc;
}

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

itemSchema.set('versionKey', 'version');
itemSchema.plugin(updateIfCurrentPlugin);

itemSchema.statics.build = (attrs: ItemAttrs) => {
  return new Item(attrs);
};

export const Item = mongoose.model<ItemDoc, ItemModel>(
  'Item',
  itemSchema,
);
