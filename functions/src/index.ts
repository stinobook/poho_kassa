/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https'
import { initializeApp } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'

initializeApp()
const database = getDatabase()

const payconiqTransactionsRef = database.ref('payconiqTransactions')

export type PayConiqPaymentStatus =
  | 'PENDING'
  | 'IDENTIFIED'
  | 'CANCELLED'
  | 'AUTHORIZED'
  | 'AUTHORIZATION_FAILED'
  | 'EXPIRED'
  | 'FAILED'
  | 'SUCCEEDED'

export type PayconiqCallbackUrlBody = {
  paymentId: string
  transferAmount: number
  tippingAmount: number
  amount: number
  totalAmount: number
  description: string
  createdAt: string
  expireAt: string
  status: PayConiqPaymentStatus
}

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
  if (!amount || !description) response.send('invalid request')
  else {
    const body = JSON.stringify({
      amount: Number(amount) * 100,
      currency: 'EUR',
      description,
      callbackUrl: 'https://payconiqcallbackurl-3nwzkpsnfa-uc.a.run.app'
    })
    const _response = await fetch(apiURL, { headers, body, method: 'POST' })
    const payment = await _response.json()
    response.send(payment)
  }
})

export const cancelPayment = onRequest({ cors }, async (request, response) => {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${PAYCONIQ_API_KEY}`)
  headers.set('Content-Type', 'application/json')
  const { payment } = request.query

  if (!payment) response.send('invalid cancel request')
  else {
    const _response = await fetch(payment as string, { headers, method: 'DELETE' })
    response.status(_response.status).send(await _response.text())
  }
})

export const payconiqCallbackUrl = onRequest({ cors: 'https://api.payconiq.com' }, async (request, response) => {
  const payment = request.body as PayconiqCallbackUrlBody
  if (payment.status !== 'PENDING' && payment.status !== 'AUTHORIZED' && payment.status !== 'IDENTIFIED') {
    await payconiqTransactionsRef.child(payment.paymentId).update({ status: payment.status })
    await payconiqTransactionsRef.child(payment.paymentId).remove()
  } else {
    await payconiqTransactionsRef.child(payment.paymentId).update({ status: payment.status })
  }
  response.status(200).send('ok')
})
// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
