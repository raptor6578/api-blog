import configLoaderService from './configLoader.service'
import mongoose from 'mongoose'

class DatabaseService {

  private config = configLoaderService.getConfig()
  private uri: string

  constructor() {
    this.uri = `mongodb://${this.config.mongo.login}:${this.config.mongo.password}@${this.config.mongo.host}:${this.config.mongo.port}/${this.config.mongo.db}`
  }

  public connect() {
    mongoose.connect(this.uri)
     .then(() => console.log(`MongoDB connected on server: ${this.config.mongo.host}:${this.config.mongo.port}`))
     .catch(err => console.error('MongoDB connection error:', err))
  }

}
export default new DatabaseService