import mongoose, { Schema, Document, Model } from "mongoose";
import {IUserModel} from "../User/User";
import {IProduct} from "../Product/Product";

export interface IShoppingList {
  creationDate: Date,
  author?: IUserModel | string,
  name: string,
  products: string[],
  state: 'active' | 'inactive',
}

export interface IShoppingListDocument extends Document, IShoppingList{
}

export interface IShoppingListModel extends Model<IShoppingListDocument> {
  getSimpleLists(): Promise<{}[]>,
  closeList(id: string): Promise<boolean>,
  getProducts(id: string): Promise<{}[]>,
  getSimpleList(id: string): Promise<{}>,
}

const shoppingListSchema = new Schema<IShoppingListDocument>({
  creationDate: {
    type: Date,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});

shoppingListSchema.statics.getProducts = async function(listId) {
  const list = await this
    .findById(listId)
    .populate('products')
    .lean();

  return list.products;
};

shoppingListSchema.statics.closeList = function(id) {
  return this.findByIdAndUpdate(id, { isActive: false });
};

shoppingListSchema.statics.getSimpleLists = async function() {
  const lists = await this
    .find()
    .populate('author', 'login')
    .populate('products')
    .select(['creationDate', 'author', 'name', 'isActive'])
    .lean();

  return lists.map(list => ({
    ...list,
    productsNumber: list.products?.length,
  }));
};

shoppingListSchema.statics.getSimpleList = async function(id) {
  const list = await this
    .findById(id)
    .populate('author', 'login')
    .select(['creationDate', 'author', 'name', 'isActive'])
    .lean();

  return {
    ...list,
    productsNumber: list.products?.length,
  };
};

export default mongoose.model<IShoppingListDocument, IShoppingListModel>('ShoppingList', shoppingListSchema);
