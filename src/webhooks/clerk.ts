import { WebhookEvent } from '@clerk/clerk-sdk-node'
import { Request, Response } from 'express'
import { Webhook } from 'svix'

export async function handleClerkWebhook(req: Request, res: Response) {
  console.log('Received webhook.')
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    throw new Error('You need a WEBHOOK_SECRET in your .env')
  }

  // Get the headers and body
  console.log(`getting headers`)
  const headers = req.headers
  let payload = req.body
  console.log(`req type: ${typeof req}`)
  console.log(`Request URL: ${req.url}`)
  console.log(`Request Method: ${req.method}`)
  console.log(`Request Headers: ${JSON.stringify(headers)}`)
  console.log(`Request Body: ${JSON.stringify(req.body)}`)
  console.log(`req.body type: ${typeof req.body}`)
  console.log(`payload: ${payload}`)
  if (!payload) {
    return res.status(400).json({
      success: false,
      message: 'Error occurred -- unable to extract payload from request.',
    })
  }
  // Get the Svix headers for verification
  console.log(`getting svix headers`)
  const svix_id = headers['svix-id'] as string
  const svix_timestamp = headers['svix-timestamp'] as string
  // svix_timestamp = Math.floor(Date.now() / 1000).toString()
  const svix_signature = headers['svix-signature'] as string

  // If there are no Svix headers, error out
  console.log(`checking svix headers`)
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({
      success: false,
      message: 'Error occurred -- no svix headers',
    })
  } else {
    console.log(`svix headers found`)
    console.log(`svix_id: ${svix_id}`)
    console.log(`svix_timestamp: ${svix_timestamp}`)
    console.log(`svix_signature: ${svix_signature}`)
  }

  // Create a new Svix instance with your secret.
  console.log(`creating webhook`)
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If the verification fails, error out and  return error code
  try {
    console.log(`verifying webhook`)
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err: any) {
    console.error('Error verifying webhook:', err.message)
    return res.status(400).json({
      success: false,
      message: err.message,
    })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data
  const eventType = evt.type
  console.log(`Webhook with an ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', evt.data)

  return res.status(200).json({
    success: true,
    message: 'Webhook received',
  })
}
