/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https'

const { PAYCONIQ_API_KEY } = process.env

// remove ext when production
const apiURL = `https://api.payconiq.com/v3/payments`

const cors = ['https://pohoapp.web.app']

export const createPayment = onRequest({ cors }, async (request, response) => {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${PAYCONIQ_API_KEY}`)
  headers.set('Cache-Control', 'no-cache')
  headers.set('Content-Type', 'application/json')
  const { amount, description } = request.query
  if (!amount || !description) return response.send('invalid request')
  const body = JSON.stringify({
    amount,
    currency: 'EUR',
    description,
    callbackUrl: 'https://us-central1-poho-app.cloudfunctions.net/payconiqCallbackUrl'
  })
  const _response = await fetch(apiURL, { headers, body, method: 'POST' })
  const payment = await _response.json()
  response.send(payment)
  return payment
})

export const payconiqCallbackUrl = onRequest({ cors: 'https://api.payconiq.com' }, async (request, response) => {
  console.log(request)
})
// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
