import BaseService from './baseService'
import { UserRepository } from '../3-dal/repositories'
import bcrypt from 'bcrypt'
import { ResultModel } from '../models/resultModel'

class UserService extends BaseService {

  constructor() {
    const repository = new UserRepository()
    super(repository)
    this._repository = repository
  }

  async getByFilters(query) {
    const filters = {
      page: query.page,
      itemsPerPage: query.itemsPerPage,
      firstName: query.firstName,
      firstName: query.email,
      includeDisabled: query.includeDisabled == 'false' ? false : true
    }
    const result = await this._repository.getByFilters(filters)
    return result
  }

  // Redefine create method
  async create(user) {
    const saltRounds = 10
    const hash = await bcrypt.hashSync(user.password, saltRounds)
    user.password = hash
    const result = await this._repository.create(user)
    return result
  }

  /**
   * Obtiene un usuario y compara la contraseña
   * guardada en la db con la pasada por parametro
   * @param {*} loginUser datos del usuario a loguear
   */
  async getUserForAuth(loginUser) {
    let result = await this._repository.getUserByEmail(loginUser.email, true)
    if (result.statusCode === 200) {
      const user = result.body
      if (!user.password) {
        result = new ResultModel(409, 'The account isn\'t activated')
      }
      const validPassword = await bcrypt.compare(
        loginUser.password,
        user.password
      )
      if (validPassword) {
        result.body = user
      } else {
        result = new ResultModel(409, 'Wrong credentials')
      }       
    }
    return result 
  }

}

module.exports = UserService