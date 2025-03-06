import { getModelForClass, prop, pre, modelOptions } from '@typegoose/typegoose'
import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcrypt'

/**
 * Options for the User model's schema, enabling automatic timestamps for each document.
 * This will add `createdAt` and `updatedAt` fields automatically to the User model.
 */
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})

/**
 * Pre-save middleware that automatically hashes the user's password before saving it to the database.
 * This is triggered only if the password field is modified, ensuring that the password is always stored securely.
 */
@pre<User>('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
  }
})

/**
 * Schema definition for the User document. Represents a user in the database with various credentials and personal details.
 * Includes fields for authentication and authorization purposes.
 */
class User extends Document {

  @prop({ default: () => new mongoose.Types.ObjectId() })
  public _id!: mongoose.Types.ObjectId

  @prop({ required: true, unique: true, index: true })
  public email!: string

  @prop()
  public idFacebook?: number

  @prop()
  public idGoogle?: number

  @prop({ required: true, select: false })
  public password!: string

  @prop({ default: () => Date.now() })
  public created?: Date

  @prop()
  public lastConnection?: Date

  @prop({ type: () => [String], default: [] })
  public roles?: string[]

  @prop({ default: false })
  public confirm?: boolean
  
}

const UserModel = getModelForClass(User)
export { UserModel, User as UserSchema }