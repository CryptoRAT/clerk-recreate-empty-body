import { handleClerkWebhook } from './webhooks/clerk.js'

import cors from 'cors'
import express from 'express'
import http from 'http'



// ---------------------------------
// Environment Setup
// ---------------------------------
const environment = process.env.NODE_ENV || 'development'
if (!environment || environment.trim() === '') {
    process.env.NODE_ENV = 'local'
}
console.log(`Runtime Environment: ${environment}`)

// ---------------------------------
// Express Setup
// ---------------------------------
const expressApp = express()
const httpServer = http.createServer(expressApp)
const expressPort = process.env.PORT || 8080



expressApp.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

expressApp.get('/', (req, res) => {
    console.log('request: ', req)
    res.redirect(`/graphql`)
})


cors({ origin: '*' })
expressApp.use(cors())
// ---------------------------------
// Add webhooks
// ---------------------------------
expressApp.post('/webhooks/clerk', handleClerkWebhook)

// ---------------------------------
// Start the server
// ---------------------------------
httpServer
    .listen(expressPort)
    .once('listening', (...stuff) => {
        console.log(stuff)
        console.log(`🚀 Server is ready at http://localhost:${expressPort}/graphql`)
    })
    .once('error', err => {
        console.error('💀 Error starting the node server', err)
    })
console.log('All servers started, check logs/*.log for more details.')
