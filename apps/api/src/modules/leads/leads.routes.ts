import { Hono } from 'hono'
import * as leadService from './leads.service'

const leads = new Hono()

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
  const data = await leadService.create(body)
  return c.json(data, 201)
})

leads.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const data = await leadService.update(id, body)
  return c.json(data)
})

leads.delete('/:id', async (c) => {
  const id = c.req.param('id')
  await leadService.remove(id)
  return c.json({ success: true })
})

export { leads }
