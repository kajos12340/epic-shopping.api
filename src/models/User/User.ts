import mongose, { Schema, Document, Model, Promise } from "mongoose";
import Crypto from 'crypto-js';
import moment from "moment";

import {IMessage} from "../Message/Message";

export interface IUser {
  login: string,
  password: string,
  email: string,
  registrationDate: Date,
  lastLoginDate?: Date,
  isConfirmed?: Date,
  messages?: IMessage[],
  color: string,
}

interface IUserDocument extends IUser, Document { }

export interface IUserModel extends Model<IUserDocument> {
  logIn: (login: string, password: string) => Promise<IUserDocument>,
  register: (userData: IUser) => Promise<IUserDocument>,
  login?: string,
}

const userSchema = new Schema<IUserDocument>({
  login: {
    type: String,
    required: true,
    maxlength: 20,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    maxlength: 20,
    unique: true,
  },
  registrationDate: {
    type: Date,
    required: true,
  },
  lastLoginDate: {
    type: Date,
  },
  isConfirmed: {
    type: Boolean,
  },
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
  color: {
    required: true,
    type: String,
  }
});

userSchema.statics.logIn = function(login: string, password: string): IUser {
    const hashedPassword = Crypto.SHA256(password).toString(Crypto.enc.Base64);
    return this.findOneAndUpdate({
      login,
      password: hashedPassword,
    }, { lastLoginDate: moment().toDate() });
};

userSchema.statics.register = function(userData: IUser): Promise<IUserDocument> {
  const hashedPassword = Crypto.SHA256(userData.password).toString(Crypto.enc.Base64);

  const user = new this({
    ...userData,
      password: hashedPassword,
  });

  return user.save();
};

export default mongose.model<IUserDocument, IUserModel>('User', userSchema);
