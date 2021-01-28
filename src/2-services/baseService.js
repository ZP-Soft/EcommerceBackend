/**
 * BaseService: Clase encargada de encapsular el comportamiento 
 * generalizado de los servicios 
 */
class BaseService {

  constructor(EntityRepository) {
    this._entityRepository = EntityRepository
  }

  async getAll(pagination) {
    const entities = await this._entityRepository.getAll(pagination)
    return entities
  }

  async getById(id) {
    const entity = await this._entityRepository.getById(id)
    return entity
  }

  async create(entity) {
    const createdEntity = await this._entityRepository.create(entity)
    return createdEntity
  }

  async update(id, entity) {
    const updatedEntity = await this._entityRepository.update(id, entity)
    return updatedEntity
  }

  async delete(id) {
    const deletedEntity = await this._entityRepository.delete(id)
    return deletedEntity
  }

  async logicalEnable(id, userId, status) {
    const enabledEntity = await this._entityRepository.logicalEnable(id, userId, status)
    return enabledEntity
  }

}

module.exports = BaseService