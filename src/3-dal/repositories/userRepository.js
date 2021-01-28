import config from '../../config/config'
import { getManager } from 'typeorm'
import { User } from '../entities/User'
import BaseRepository from './baseRepository'
import { ResultModel } from '../../models/resultModel'

class UserRepository extends BaseRepository {

  constructor() {
    super(User)
    this._manager = getManager(config.CONNECTION_NAME)
    this._entity = User
  }

  async getByFilters(filters) {
    try {
      const itemsPerPage = parseInt(filters.itemsPerPage)
      const page = parseInt(filters.page)
      const skip = (page - 1) * itemsPerPage

      query = this._manager.getRepository(User).createQueryBuilder()
      if (filters.firstName != null && filters.firstName != '') {
        query.where('User.firstName like :firstName', { firstName: '%' + filters.firstName + '%' })
      }
      if (filters.email != null && filters.email != '') {
        query.andWhere('User.email like :email', { email: '%' + filters.email + '%' })
      }
      if (!filters.includeDisabled) {
        query.andWhere('User.isEnabled = :isEnabled', { isEnabled: true })
      }

      // -1 == All items
      if (itemsPerPage != -1) {
        query.skip(skip)
        query.take(itemsPerPage)
      }

      let queryResult = await query.getManyAndCount()
      const result = {
        items: queryResult[0],
        totalItems: queryResult[1]
      }
      let statusCode = (result.totalItems > 0) ? 200 : 404
      let message = (result.totalItems > 0) ? 'Users found successfuly.' : 'Users not found'
      let response = new ResultModel(statusCode, message, result)
      return response
    } catch (error) {
      let response = new ResultModel(500, 'An error has ocurred.', '', error, 'userRepository-getByFilters')
      return response
    }
  }

  async getUserByEmail(email, onlyActive) {
    try {
      let query = this._manager.getRepository(this._entity).createQueryBuilder()
      query.where('User.email = :email', { email: email })
      if (onlyActive) {
        query.andWhere('User.isEnabled = :onlyActive', {onlyActive: onlyActive})
      }
      const result = await query.getOne()
      const statusCode = (result) ? 200 : 404
      const message = (result) ? 'User found.' : 'User not found.'
      const response = new ResultModel(statusCode, message, result)
      return response      
    } catch (error) {
      const response = new ResultModel(500, 'An error has ocurred', '', error,'userRepository-getUserByEmail')
      return response
    }
  }

}

module.exports = UserRepository