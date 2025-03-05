import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { UserSchema } from './user.model'
import mongoose, { Document } from 'mongoose'

enum ContentType {
  Article = 'Article',
  Comment = 'Comment',
}

class Like extends Document {

  @prop({ default: () => new mongoose.Types.ObjectId() })
  public _id!: mongoose.Types.ObjectId

  @prop({ ref: () => UserSchema, required: true })
  public user!: Ref<UserSchema>

  @prop({ enum: ContentType, required: true })
  public contentType!: ContentType

  @prop({ required: true, index: true, refPath: 'contentType' })
  public targetId!: string

  @prop({ default: () => Date.now() })
  public likedAt!: Date

  @prop({ required: true })
  public value!: number
}

const LikeModel = getModelForClass(Like)
export { LikeModel, Like as LikeSchema }