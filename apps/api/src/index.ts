import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { env } from './lib/env'
import { auth } from './lib/auth'
import { errorHandler } from './middlewares/error-handler'
import { companies } from './modules/companies/companies.routes'
import { leads } from './modules/leads/leads.routes'

const app = new Hono()

app.use('/*', cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}))

app.onError(errorHandler)

app.get('/', (c) => {
  return c.text('Formalyon CRM API')
})

app.get('/health', (c) => {
  return c.json({ ok: true })
})

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

app.route('/api/companies', companies)
app.route('/api/leads', leads)

console.log(`Server running on ${env.BETTER_AUTH_URL}`)

serve({
  fetch: app.fetch,
  port: env.PORT,
})
