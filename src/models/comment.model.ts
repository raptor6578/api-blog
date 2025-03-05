import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { UserSchema } from './user.model'
import { LikeSchema } from './like.model'
import mongoose, { Document } from 'mongoose'

enum CommentContentType {
  Article = 'Article'
}

class Comment extends Document {

  @prop({ default: () => new mongoose.Types.ObjectId() })
  public _id!: mongoose.Types.ObjectId

  @prop({ ref: () => UserSchema, required: true })
  public author!: Ref<UserSchema>

  @prop({ enum: CommentContentType, required: true })
  public contentType!: CommentContentType

  @prop({ required: true, index: true, refPath: 'contentType' })
  public targetId!: string

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
export { CommentModel, CommentContentType, Comment as CommentSchema }