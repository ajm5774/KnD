
import db from '../db';
import { prop, Typegoose, staticMethod, ModelType } from 'typegoose';

export class User extends Typegoose {
  @prop({
    required: true
  })
  id!: string;

  @prop({
    default: 0
  })
  karma!: number;

  @staticMethod
  static increment(this: ModelType<User> & typeof User, conditions: any, amount: number) {
    return this.updateMany(conditions, { $inc: { karma: amount } });
  }
}

export const UserModel = new User().getModelForClass(User, { existingConnection: db })