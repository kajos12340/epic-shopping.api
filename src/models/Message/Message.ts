import mongoose, { Schema, Document, Model } from "mongoose";
import moment from 'moment';

import User, { IUserModel } from "../User/User";

export interface IMessage {
  date: Date,
  author?: IUserModel | string,
  text: String,
}

export interface IMessageDocument extends IMessage, Document {
}

export interface IMessageModel extends Model<IMessageDocument> {
  removeAllFromBeforeToday(): Promise<void>,
  getMessagesWithAuthors(id: string): Promise<IMessageDocument[]>,
}

const messageSchema = new Schema<IMessageDocument>({
  date: {
    type: Date,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
    maxlength: 150,
  }
});

messageSchema.statics.removeAllFromBeforeToday = function (): Promise<void> {
  const date12hBefore = moment().subtract(4, 'h');
  const parsedDate = date12hBefore.toDate();

  return this.deleteMany({ date: { $lte: parsedDate } });
};

messageSchema.statics.getMessagesWithAuthors = async function (currentUserId: string): Promise<IMessageDocument[]> {
  const data = await this.find()
    .populate('author', 'login color')
    .lean();

  return data;
};

export default mongoose.model<IMessageDocument, IMessageModel>('Message', messageSchema);
