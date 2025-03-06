import * as fs from 'fs'
import * as path from 'path'
import Joi from 'joi'
import * as dotenv from 'dotenv'

dotenv.config()

/**
 * Configuration interface detailing the structure expected for application settings.
 */
export interface Config {
    allowOrigin: string
    jwt: {
        secret: string
        expiresIn: number
    }
    expressPort: number
    mongo: {
        host: string
        port: number
        login: string
        password: string
        db: string
    }
    facebook: {
        clientId: string
        clientSecret: string
        callbackUrl: string
    }
    google: {
        clientId: string
        clientSecret: string
        callbackUrl: string
    }
    passportRedirectFront: string
}

/**
 * Service class for loading and validating application configuration from environment-specific JSON files.
 * Utilizes the singleton pattern to ensure that configuration is loaded and validated only once,
 * and then reused throughout the application.
 */
export class ConfigLoaderService {
    private static instance: Config
    private constructor() {}

    /**
     * Validates the configuration object against a Joi schema to ensure all required fields are present
     * and correctly formatted.
     * @param config - The configuration object to validate.
     * @throws {Error} - Throws an error if the configuration does not conform to the schema.
     */
    private static validateConfig(config: any): void {
        const schema = Joi.object({
            allowOrigin: Joi.string().required(),
            jwt: Joi.object({
                secret: Joi.string().required(),
                expiresIn: Joi.string().required()
            }).required(),
            expressPort: Joi.number().required(),
            mongo: Joi.object({
                host: Joi.string().required(),
                port: Joi.number().required(),
                login: Joi.string().required(),
                password: Joi.string().required(),
                db: Joi.string().required()
            }).required(),
            facebook: Joi.object({
                clientId: Joi.string().required(),
                clientSecret: Joi.string().required(),
                callbackUrl: Joi.string().uri().required()
            }).required(),
            google: Joi.object({
                clientId: Joi.string().required(),
                clientSecret: Joi.string().required(),
                callbackUrl: Joi.string().uri().required()
            }).required(),
            passportRedirectFront: Joi.string().uri().required()
        });

        const { error } = schema.validate(config)
        if (error) {
            throw new Error(`Config validation error: ${error.message}`)
        }
    }

    /**
     * Gets the application configuration by reading from a JSON file based on the current NODE_ENV,
     * validating it, and then caching it as a singleton instance.
     * @returns {Config} - The application configuration object.
     */
    public static getConfig(): Config {
        if (!this.instance) {
            const environment = process.env.NODE_ENV || 'development'
            const configPath = path.join(__dirname, `../../src/configs/${environment}.config.json`)
            const configData = fs.readFileSync(configPath, 'utf8')
            const config: Config = JSON.parse(configData)
            this.validateConfig(config)
            this.instance = config
        }
        return this.instance
    }
    
}

export default ConfigLoaderService