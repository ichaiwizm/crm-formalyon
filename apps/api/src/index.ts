import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { auth } from './lib/auth'
import { companies } from './modules/companies/companies.routes'
import { leads } from './modules/leads/leads.routes'

const app = new Hono()

app.use('/*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

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

const port = 3000
console.log(`Server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
