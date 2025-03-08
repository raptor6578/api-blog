import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { UserSchema } from './user.model'
import { LikeSchema } from './like.model'
import mongoose, { Document } from 'mongoose'
import { ContentType } from '../enums/contentType.enum'

/**
 * Schema definition for the Comment document. Represents a comment made by a user on various types of content.
 * Comments can be standalone or replies to other comments (nested comments).
 */
class Comment extends Document {

  @prop({ default: () => new mongoose.Types.ObjectId() })
  public _id!: mongoose.Types.ObjectId

  @prop({ ref: () => UserSchema, required: true })
  public author!: Ref<UserSchema>

  @prop({ enum: ContentType, required: true })
  public contentType!: ContentType

  @prop({ required: true, index: true, refPath: 'contentType' })
  public targetId!: mongoose.Types.ObjectId

  @prop({ required: true })
  public content!: string

  @prop({ default: () => Date.now() })
  public postedAt!: Date

  @prop({ ref: () => LikeSchema, default: [] })
  public likes!: Ref<LikeSchema>[]

  @prop({ ref: () => Comment })
  public parentComment?: Ref<Comment>

}

const CommentModel = getModelForClass(Comment)
export { CommentModel, Comment as CommentSchema }