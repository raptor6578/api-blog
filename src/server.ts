import 'express-async-errors'
import express from 'express'
import configLoaderService from './services/configLoader.service'
import databaseService from './services/database.service'
import middlewaresLoader from './loaders/middlewares.loader'
import routesLoader from './loaders/routes.loader'

/**
 * Main server file for setting up the Express application. This script configures the application
 * by setting up database connections, loading middlewares, configuring routes, and finally
 * starting the server.
 *
 * Steps:
 * 1. Loads application configuration using the ConfigLoaderService.
 * 2. Initializes the Express application.
 * 3. Connects to the MongoDB database using the DatabaseService.
 * 4. Loads all configured middlewares into the application using the MiddlewaresLoader.
 * 5. Sets up all routes using the RoutesLoader.
 * 6. Starts the server on the configured port and logs that the server is running.
 */
export function startServer(): void {

	const config = configLoaderService.getConfig()
	const app = express()

	databaseService.connect()
	middlewaresLoader(app)
	routesLoader(app)

	app.listen(config.expressPort, () => {
		console.log('Server running on port: ' + config.expressPort)
	})

}

startServer()