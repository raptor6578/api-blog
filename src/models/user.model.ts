import { getModelForClass, prop, pre, modelOptions } from '@typegoose/typegoose'
import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcrypt'

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})

@pre<User>('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
  }
})

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