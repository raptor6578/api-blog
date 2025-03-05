import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { UserSchema } from './user.model'
import mongoose, { Document } from 'mongoose'

enum LikeContentType {
  Article = 'Article',
  Comment = 'Comment',
}

enum ValueType {
  Down = -1,
  Up = 1
}

class Like extends Document {

  @prop({ default: () => new mongoose.Types.ObjectId() })
  public _id!: mongoose.Types.ObjectId

  @prop({ ref: () => UserSchema, required: true })
  public voter!: Ref<UserSchema>

  @prop({ enum: LikeContentType, required: true })
  public contentType!: LikeContentType

  @prop({ required: true, index: true, refPath: 'contentType' })
  public targetId!: mongoose.Types.ObjectId

  @prop({ default: () => Date.now() })
  public likedAt!: Date

  @prop({ enum: ValueType, required: true })
  public value!: ValueType
}

const LikeModel = getModelForClass(Like)
export { LikeModel, Like as LikeSchema, LikeContentType, ValueType }