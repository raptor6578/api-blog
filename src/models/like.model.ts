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

  /**
   * The unique identifier for the like, automatically generated by MongoDB.
   */
  @prop({ default: () => new mongoose.Types.ObjectId() })
  public _id!: mongoose.Types.ObjectId

  /**
   * Reference to the User who performed the like or dislike.
   * This is a required field linking to the User schema.
   */
  @prop({ ref: () => UserSchema, required: true })
  public voter!: Ref<UserSchema>

  /**
   * The type of content that is being liked or disliked, defined by the ContentType enum.
   */
  @prop({ enum: ContentType, required: true })
  public contentType!: ContentType

  /**
   * The ID of the target content that is liked or disliked.
   * This field uses an index and a refPath to dynamically link to the type of content.
   */
  @prop({ required: true, index: true, refPath: 'contentType' })
  public targetId!: mongoose.Types.ObjectId

  /**
   * The date and time when the like or dislike was performed.
   * Defaults to the current date and time.
   */
  @prop({ default: () => Date.now() })
  public likedAt!: Date

  /**
   * The value of the like, indicating whether it is an upvote or downvote, as defined by the ValueType enum.
   */
  @prop({ enum: ValueType, required: true })
  public value!: ValueType
}

const LikeModel = getModelForClass(Like)
export { LikeModel, Like as LikeSchema, ValueType }
