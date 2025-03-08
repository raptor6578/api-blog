import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { UserSchema } from './user.model'
import mongoose, { Document } from 'mongoose'
import { ContentType } from '../enums/contentType.enum'

/**
 * Enum to represent the value of a like, supporting both upvotes and downvotes.
 */
enum ValueType {
  Down = -1,
  Up = 1
}

/**
 * Schema definition for the Like document. Represents a like or dislike action by a user on different types of content.
 * Each like is associated with a user (voter), a content type, and a target content ID. The value represents whether
 * the action is a like (upvote) or a dislike (downvote).
 */
class Like extends Document {

  @prop({ default: () => new mongoose.Types.ObjectId() })
  public _id!: mongoose.Types.ObjectId

  @prop({ ref: () => UserSchema, required: true })
  public voter!: Ref<UserSchema>

  @prop({ enum: ContentType, required: true })
  public contentType!: ContentType

  @prop({ required: true, index: true, refPath: 'contentType' })
  public targetId!: mongoose.Types.ObjectId

  @prop({ default: () => Date.now() })
  public likedAt!: Date

  @prop({ enum: ValueType, required: true })
  public value!: ValueType
}

const LikeModel = getModelForClass(Like)
export { LikeModel, Like as LikeSchema, ValueType }