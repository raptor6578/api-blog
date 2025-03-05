import * as fs from 'fs'
import * as path from 'path'
import Joi from 'joi'
import * as dotenv from 'dotenv'

dotenv.config()

interface Config {
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

class ConfigLoaderService {
    private static instance: Config
    private constructor() {}

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