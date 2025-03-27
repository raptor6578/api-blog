import { getModelForClass, prop, pre, Ref } from '@typegoose/typegoose'
import { UserSchema } from './user.model'
import { CommentSchema } from './comment.model'
import { LikeSchema } from './like.model'
import mongoose, { Document } from 'mongoose'
import getSlug from 'speakingurl'

/**
 * Pre-save middleware for the Article model.
 * Automatically generates and assigns a slug to the article based on its title before saving,
 * using the `speakingurl` library to ensure the slug is URL-friendly and localized to French.
 */
@pre<Article>('save', async function() {
  if (this.isModified('title')) {
    this.slug = getSlug(this.title, { lang: 'fr' })
  }
})

/**
 * Schema definition for the Article document. Represents an article authored by a user,
 * with functionality to add comments and likes from other users.
 * This schema includes references to other documents such as User, Comment, and Like.
 */
class Article extends Document {
  /**
   * The unique identifier for the article, automatically generated by MongoDB.
   */
  @prop({ default: () => new mongoose.Types.ObjectId() })
  public _id!: mongoose.Types.ObjectId

  /**
   * Reference to the User who authored the article.
   * This is a required field linking to the User schema.
   */
  @prop({ ref: () => UserSchema, required: true })
  public author!: Ref<UserSchema>

  /**
   * The title of the article, which is unique and required.
   */
  @prop({ required: true, unique: true })
  public title!: string

  /**
   * The URL-friendly slug derived from the article title.
   * This field is unique and generated via pre-save middleware.
   */
  @prop({ unique: true })
  public slug!: string

  /**
   * The main content of the article, stored as text.
   */
  @prop({ required: true })
  public content!: string

  /**
   * An array of image names associated with the article, stored as strings.
   */
  @prop({ default: [], type: () => [String] })
  public imageNames!: string[]

  /**
   * The publication date of the article, defaults to the current date and time.
   */
  @prop({ default: () => Date.now() })
  public publishedAt!: Date

  /**
   * An array of references to Comment documents related to the article.
   * This allows for nested commenting on the article.
   */
  @prop({ ref: () => CommentSchema, default: [] })
  public comments!: Ref<CommentSchema>[]

  /**
   * An array of references to Like documents, capturing user likes or dislikes on the article.
   */
  @prop({ ref: () => LikeSchema, default: [] })
  public likes!: Ref<LikeSchema>[]
}

const ArticleModel = getModelForClass(Article)
export { ArticleModel, Article as ArticleSchema }
