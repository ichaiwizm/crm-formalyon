import { createCrudRoutes } from '../../lib/crud-factory'
import { createCompanySchema, updateCompanySchema } from './companies.schema'
import * as companyService from './companies.service'

export const companies = createCrudRoutes({
  service: companyService,
  createSchema: createCompanySchema,
  updateSchema: updateCompanySchema,
  entityName: 'Entreprise',
})
