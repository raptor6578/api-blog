import { getModelForClass, prop, pre, Ref } from '@typegoose/typegoose'
import { UserSchema } from './user.model'
import { CommentSchema } from './comment.model'
import { LikeSchema } from './like.model'
import mongoose, { Document } from 'mongoose'
import getSlug from 'speakingurl'

@pre<Article>('save', async function() {
  if (this.isModified('title')) {
    this.slug = getSlug(this.title, { lang: 'fr' });
  }
})

class Article extends Document {

  @prop({ default: () => new mongoose.Types.ObjectId() })
  public _id!: mongoose.Types.ObjectId

  @prop({ ref: () => UserSchema, required: true })
  public author!: Ref<UserSchema>

  @prop({ required: true, unique: true })
  public title!: string

  @prop({ unique: true })
  public slug!: string

  @prop({ required: true })
  public content!: string

  @prop({ default: () => Date.now() })
  public publishedAt!: Date

  @prop({ ref: () => CommentSchema, default: [] })
  public comments!: Ref<CommentSchema>[]

  @prop({ ref: () => LikeSchema, default: [] })
  public likes!: Ref<LikeSchema>[]

}

const ArticleModel = getModelForClass(Article)
export { ArticleModel, Article as ArticleSchema }