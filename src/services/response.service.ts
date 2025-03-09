import * as fs from 'fs'
import * as path from 'path'

/**
 * Interfaces representing the details of a response.
 */
interface ResponseDetails {
  statusCode: number
  message: string
}
interface ResponseType {
  [type: string]: ResponseDetails
}
interface ResponseConfig {
  [controller: string]: {
    [method: string]: ResponseType
  }
}

/**
 * Service for managing API response messages and status codes.
 * This service loads a JSON configuration file and provides methods to retrieve specific response details.
 */
export class ResponseService {

  private responses: ResponseConfig

  /**
   * Constructs a new instance of the ResponseService.
   * It attempts to load the response configurations from a JSON file.
   */
  constructor() {
    try {
      const configPath = path.join(__dirname, `../../src/configs/response.config.json`)
      const configData = fs.readFileSync(configPath, 'utf8')
      this.responses = JSON.parse(configData)
    } catch (error) {
      console.error("Failed to load response configurations:", error)
      this.responses = {}
    }
  }

  /**
   * Retrieves the status code and message for a specific controller, method, and type.
   * If the specific configuration does not exist, it returns a default error response.
   *
   * @param controller - The name of the controller.
   * @param method - The method within the controller.
   * @param type - The type of response needed (e.g., 'success', 'error').
   * @returns The response details including status code and message.
   */
  public getStatusCodeAndMessage(
    controller: string, 
    method: string, 
    type: string
  ): ResponseDetails {

    const controllerConfig = this.responses[controller]
    if (!controllerConfig) {
      console.error(`Controller ${controller} not found in the response configurations.`)
      return this.getDefaultErrorResponse()
    }

    const methodConfig = controllerConfig[method]
    if (!methodConfig) {
      console.error(`Method ${method} not found in ${controller} response configurations.`)
      return this.getDefaultErrorResponse()
    }

    const typeConfig = methodConfig[type]
    if (!typeConfig) {
      console.error(`Response type ${type} not found in ${controller}.${method} response configurations.`)
      return this.getDefaultErrorResponse()
    }
  
    return typeConfig
  }
  
  /**
   * Returns a default error response when the requested configuration is missing.
   *
   * @returns A default error response with a status code of 500 and a descriptive message.
   */
  private getDefaultErrorResponse(): ResponseDetails {
    return {
      statusCode: 500,
      message: "Internal server error due to missing response configuration."
    }
  }
}

export default new ResponseService()
