import mongoose, { Schema, Document, Model } from 'mongoose';
import UnitEnum from '../../enums/UnitEnum';
import ShoppingList from '../ShoppingList/ShoppingList';

export interface IProduct extends Document{
  shoppingList: string,
  name: string,
  quantity: number,
  unit: UnitEnum,
  inCart: boolean,
}

export interface IProductModel extends Model<IProduct>{
  updateInCartStatus(productId: string, status: boolean): Promise<void>,
  addNewProduct(data: {}): Promise<void>,
  removeProduct(listId: string, productId: string): Promise<void>,
}

const productSchema = new Schema<IProduct>({
  shoppingList: {
    type: Schema.Types.ObjectId,
    ref: 'ShoppingList',
  },
  name: {
    type: String,
    required: true,
    maxlength: 60,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: Object.values(UnitEnum),
    default: UnitEnum.pack,
    required: true,
  },
  inCart: {
    type: Boolean,
    required: true,
    default: false,
  },
});

productSchema.statics.updateInCartStatus = function (productId, inCartStatus) {
  return this.findByIdAndUpdate(productId, { inCart: inCartStatus });
};

productSchema.statics.addNewProduct = async function (data) {
  const product = new this({
    shoppingList: mongoose.Types.ObjectId(data.shoppingListId),
    name: data.name,
    quantity: data.quantity,
    unit: UnitEnum[data.unit],
  });
  const savedProduct = await product.save();
  await ShoppingList.findByIdAndUpdate(data.shoppingListId, {
    $addToSet: { products: savedProduct._id },
  });
};

productSchema.statics.removeProduct = async function (listId, productId) {
  this.findByIdAndDelete(productId);

  await ShoppingList.findByIdAndUpdate(listId, {
    $pull: { products: productId },
  });
};

export default mongoose.model<IProduct, IProductModel>('Product', productSchema);
