import 'express-async-errors'
import express from 'express'
import configLoaderService from './services/configLoader.service'
import databaseService from './services/database.service'
import middlewaresLoader from './loaders/middlewares.loader'
import routesLoader from './loaders/routes.loader'

const config = configLoaderService.getConfig()
const app = express()

databaseService.connect()
middlewaresLoader(app)
routesLoader(app)

app.listen(config.expressPort, () => {
	console.log('Server running on port: ' + config.expressPort)
})
