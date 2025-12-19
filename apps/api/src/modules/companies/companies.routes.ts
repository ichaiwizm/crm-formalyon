import { Hono } from 'hono'
import { requireAuth } from '../../middlewares/auth'
import { createCompanySchema, updateCompanySchema } from './companies.schema'
import * as companyService from './companies.service'

const companies = new Hono()

companies.use('/*', requireAuth)

companies.get('/', async (c) => {
  const data = await companyService.list()
  return c.json(data)
})

companies.get('/:id', async (c) => {
  const id = c.req.param('id')
  const data = await companyService.getById(id)
  if (!data) {
    return c.json({ error: 'Company not found' }, 404)
  }
  return c.json(data)
})

companies.post('/', async (c) => {
  const body = await c.req.json()
  const result = createCompanySchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: 'Validation failed', details: result.error.flatten() }, 400)
  }

  const data = await companyService.create(result.data)
  return c.json(data, 201)
})

companies.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const result = updateCompanySchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: 'Validation failed', details: result.error.flatten() }, 400)
  }

  const data = await companyService.update(id, result.data)
  return c.json(data)
})

companies.delete('/:id', async (c) => {
  const id = c.req.param('id')
  await companyService.remove(id)
  return c.json({ success: true })
})

export { companies }
