# clerk-recreate-empty-body

This is a simple Clerk.js example that demonstrates how to recreate an empty body in a webhook post request from clerk

## Building the project
```
yarn install
```
## Environment Variables
```
CLERK_SECRET_KEY
WEBHOOK_SECRET
```
## Running the project
```
yarn run dev
```
## Run ngrok tunnel
```
ngrok http --domain=YOUR_DOMAIN 8080
```
## Send a webhook from clerk to it.