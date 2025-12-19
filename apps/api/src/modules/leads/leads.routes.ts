import { createCrudRoutes } from '../../lib/crud-factory'
import { createLeadSchema, updateLeadSchema } from './leads.schema'
import * as leadService from './leads.service'

export const leads = createCrudRoutes({
  service: leadService,
  createSchema: createLeadSchema,
  updateSchema: updateLeadSchema,
  entityName: 'Lead',
})
