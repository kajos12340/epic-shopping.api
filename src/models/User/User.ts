import moongose, {Schema, Document, Model, Promise, Query} from "mongoose";
import Crypto from 'crypto-js';

export interface IUser {
  login: string,
  password: string,
  email: string,
  registrationDate: Date,
  lastLoginDate?: Date,
  isConfirmed?: Date,
}

interface IUserDocument extends IUser, Document { }

export interface IUserModel extends Model<IUserDocument> {
  logIn: (login: string, password: string) => Promise<IUserDocument>,
  register: (userData: IUser) => Promise<IUserDocument>,
}

const userSchema = new Schema<IUserDocument, IUserModel>({
  login: {
    type: String,
    required: true,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    maxlength: 100,
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
});

userSchema.statics.logIn = function(login: string, password: string): Query<IUserDocument, IUserDocument> {
    const hashedPassword = Crypto.SHA256(password).toString(Crypto.enc.Base64);
    return this.findOne({
      login,
      password: hashedPassword,
    });
};

userSchema.statics.register = function(userData: IUser): Promise<IUserDocument> {
  const hashedPassword = Crypto.SHA256(userData.password).toString(Crypto.enc.Base64);

  const user = new this({
    ...userData,
      password: hashedPassword,
  });

  return user.save();
};

export default moongose.model<IUserDocument, IUserModel>('User', userSchema);
