import configLoaderService from './configLoader.service'
import mongoose from 'mongoose'

/**
 * Service class for handling MongoDB database connections.
 * This class uses configuration settings loaded from the ConfigLoaderService to establish
 * a connection to MongoDB. It constructs the connection URI from these settings and manages
 * the database connection lifecycle.
 */
export class DatabaseService {

  private config = configLoaderService.getConfig()
  private uri: string

  /**
   * Constructs the DatabaseService instance by building the MongoDB URI using user credentials,
   * host, port, and database name from the application configuration.
   */
  constructor() {
    this.uri = `mongodb://${this.config.mongo.login}:${this.config.mongo.password}@${this.config.mongo.host}:${this.config.mongo.port}/${this.config.mongo.db}`
  }

  /**
   * Connects to MongoDB using the constructed URI. Logs the success or failure of the connection attempt.
   * This method handles the initial connection to MongoDB and logs the outcome to the console,
   * either indicating a successful connection or logging an error if the connection fails.
   */
  public connect() {
    mongoose.connect(this.uri)
     .then(() => console.log(`MongoDB connected on server: ${this.config.mongo.host}:${this.config.mongo.port}`))
     .catch(err => console.error('MongoDB connection error:', err))
  }

}
export default new DatabaseService