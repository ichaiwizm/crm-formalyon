import { Hono } from 'hono'
import type { z } from 'zod'
import { requireAuth } from '../middlewares/auth'
import { env } from './env'
import { ERROR_MESSAGE } from './constants'

interface CrudService<T, CreateInput, UpdateInput> {
  list: () => Promise<T[]>
  getById: (id: string) => Promise<T | null>
  create: (data: CreateInput) => Promise<T>
  update: (id: string, data: UpdateInput) => Promise<T>
  remove: (id: string) => Promise<T>
}

interface CrudOptions<T, CreateInput, UpdateInput> {
  service: CrudService<T, CreateInput, UpdateInput>
  createSchema: z.ZodType<CreateInput>
  updateSchema: z.ZodType<UpdateInput>
  entityName: string
}

function formatValidationError(error: z.ZodError) {
  if (env.NODE_ENV !== 'development') return undefined
  return error.issues.map((e) => ({ path: e.path.join('.'), message: e.message }))
}

export function createCrudRoutes<T, CreateInput, UpdateInput>(
  options: CrudOptions<T, CreateInput, UpdateInput>
) {
  const { service, createSchema, updateSchema, entityName } = options
  const router = new Hono()

  router.use('/*', requireAuth)

  router.get('/', async (c) => {
    const data = await service.list()
    return c.json(data)
  })

  router.get('/:id', async (c) => {
    const id = c.req.param('id')
    const data = await service.getById(id)
    if (!data) {
      return c.json({ error: `${entityName} ${ERROR_MESSAGE.NOT_FOUND.toLowerCase()}` }, 404)
    }
    return c.json(data)
  })

  router.post('/', async (c) => {
    const body = await c.req.json()
    const result = createSchema.safeParse(body)
    if (!result.success) {
      return c.json({ error: ERROR_MESSAGE.VALIDATION_FAILED, details: formatValidationError(result.error) }, 400)
    }
    const data = await service.create(result.data)
    return c.json(data, 201)
  })

  router.put('/:id', async (c) => {
    const id = c.req.param('id')
    const body = await c.req.json()
    const result = updateSchema.safeParse(body)
    if (!result.success) {
      return c.json({ error: ERROR_MESSAGE.VALIDATION_FAILED, details: formatValidationError(result.error) }, 400)
    }
    const data = await service.update(id, result.data)
    return c.json(data)
  })

  router.delete('/:id', async (c) => {
    const id = c.req.param('id')
    await service.remove(id)
    return c.json({ success: true })
  })

  return router
}
