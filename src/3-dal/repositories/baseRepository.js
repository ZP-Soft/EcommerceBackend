/**
 * BaseRepository: 
 * EN: This class is in charge of encapsulate the widespread
 * behavior of the data access layer.
 * ES: Clase encargada de encapsular el comportamiento 
 * generalizado de la capa de acceso a los datos
 */
import { getManager } from 'typeorm'
import config from '../../config/config'
import { ResultModel } from '../../models/resultModel'
class BaseRepository {

  constructor(Entity) {
    this._entity = Entity
    this._manager = getManager(config.CONNECTION_NAME)
  }

  async create(entityToCreate) {
    try {
      let result = await this._manager.getRepository(this._entity).save(entityToCreate)
      let response = new ResultModel(201, 'The register was created successfuly.', result)
      return response
    } catch (error) {
      let response = new ResultModel(500, 'An error has ocurred.', '', error, 'BaseRepository-create')
      return response
    }
  }

  async update(id, entityToUpdate) {
    try {
      let query =  this._manager.createQueryBuilder()
        .update(this._entity)
        .set(entityToUpdate)
        .where('id = :id', { id: String(id) })
      await query.execute()
      let entityUpdated = await this.getById(id)
      let response = new ResultModel(202, 'The register was modified successfuly.', entityUpdated)
      return response
    } catch (error) {
      let response = new ResultModel(500, 'An error has ocurred.', '', error, 'BaseRepository-update')
      return response
    }
  }

  async delete(id) {
    try {
      let query = this._manager.createQueryBuilder()
        .delete()
        .from(this._entity)
        .where('id = :id', { id: id })
      let result = await query.execute()
      let response = new ResultModel(200, 'The register was deleted successfuly.', result)
      return response
    } catch (error) {
      let response = new ResultModel(500, 'An error has ocurred.', '', error, 'BaseRepository-delete')
      return response
    }
  }

  //Alta y baja lógica
  async logicalEnable(id, userId, status) {
    try {
      let query = this._manager.createQueryBuilder()
        .update(this._entity)
        .set({
          isEnabled: status,
          lastUpdateByUserId: userId
        })
        .where('id = :id', { id: id })      
      let result = await query.execute()
      let response = new ResultModel(202, 'The register was '+ (status ? 'activated' : 'desactivated') +' successfuly.', result)
      return response
    } catch (error) {
      let response = new ResultModel(500, 'An error has ocurred.', '', error, 'BaseRepository-logicalEnable')
      return response
    }
  }

  async getAll( pagination) {
    try {
      let query = this._manager.getRepository(this._entity)
        .createQueryBuilder()
      //Pagination//
      query.skip(pagination.startIn)
      query.take(pagination.pageSize)
      //Pagination//
      let entities= await query.getManyAndCount()
      const result = {
        data: entities[0],
        meta: {
          rowsCount: entities[1]
        }
      }
      let response
      if (result.meta.rowsCount > 0) {
        response = new ResultModel(200, 'Items found.', result)
      } else {
        response = new ResultModel(404, 'Items not found.', result)
      }
      return response
    } catch (error) {
      let response = new ResultModel(500, 'An error has ocurred.', '', error, 'BaseRepository-getAll')
      return response
    }
  }

  async getById( id) {
    try {
      let query = this._manager.getRepository(this._entity)
        .createQueryBuilder('entity')
        .where('entity.id = :id', { id: id })
      const entity = await query.getOne()
      let response
      if (entity) {
        response = new ResultModel(200, 'Item found.', entity)
      } else {
        response = new ResultModel(404, 'Item not found.', entity)
      }
      return response
    } catch (error) {
      let response = new ResultModel(500, 'An error has ocurred.', '', error, 'BaseRepository-getById')
      return response
    }
  }

}

module.exports = BaseRepository