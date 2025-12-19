import { Hono } from 'hono'
import { requireAuth } from '../../middlewares/auth'
import { createLeadSchema, updateLeadSchema } from './leads.schema'
import * as leadService from './leads.service'

const leads = new Hono()

leads.use('/*', requireAuth)

leads.get('/', async (c) => {
  const data = await leadService.list()
  return c.json(data)
})

leads.get('/:id', async (c) => {
  const id = c.req.param('id')
  const data = await leadService.getById(id)
  if (!data) {
    return c.json({ error: 'Lead not found' }, 404)
  }
  return c.json(data)
})

leads.post('/', async (c) => {
  const body = await c.req.json()
  const result = createLeadSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: 'Validation failed', details: result.error.flatten() }, 400)
  }

  const data = await leadService.create(result.data)
  return c.json(data, 201)
})

leads.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const result = updateLeadSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: 'Validation failed', details: result.error.flatten() }, 400)
  }

  const data = await leadService.update(id, result.data)
  return c.json(data)
})

leads.delete('/:id', async (c) => {
  const id = c.req.param('id')
  await leadService.remove(id)
  return c.json({ success: true })
})

export { leads }
