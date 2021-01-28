import { Controller, Get, Post, Put, Delete } from '@decorators/express'
import { UserService } from '../../2-services'
import { UserModel } from '../../models/user'
import { ResultModel } from '../../models/resultModel'
import Authenticate from '../../utils/middlewares/Authenticate'


@Controller('/user') // We could define authentication middleware here
class UserController {

  constructor() {
    this._service = new UserService()
  }

  @Post('/')
  async create(req, res) {
    let newUser = req.body
    this._service.create(newUser).then(response => {
      res.status(response.statusCode).send(response)
    }).catch((error) => {
      let response = new ResultModel(500, 'An error has ocurred.', '', error)
      res.status(response.statusCode).send(response)
    })
  }

  @Get('/', [
    new Authenticate([1, 2]) // We indacte wich Roles can access to this route and subroutes
    // It can be empty and all users will have access
  ])
  async getByFilters(req, res) {
    this._service.getByFilters(req.query).then(response => {
      res.status(response.statusCode).send(response)
    }).catch((error) => {
      let response = new ResultModel(500, 'An error has ocurred.', '', error)
      res.status(response.statusCode).send(response)
    })
  }

  @Get('/:id', [
    new Authenticate([1, 2]) // We indacte wich Roles can access to this route and subroutes
    // It can be empty and all users will have access
  ])
  async getById(req, res) {
    this._service.getById(req.params.id).then(response => {
      const user = new UserModel(response.body)
      response.body = user
      res.status(response.statusCode).send(response)
    }).catch((error) => {
      let response = new ResultModel(500, 'An error has ocurred.', '', error)
      res.status(response.statusCode).send(response)
    })
  }

  @Put('/:id', [
    new Authenticate([1, 2]) // We indacte wich Roles can access to this route and subroutes
    // It can be empty and all users will have access
  ])
  async update(req, res) {
    this._service.update(req.params.id).then(response => {
      res.status(response.statusCode).send(response)
    }).catch((error) => {
      let response = new ResultModel(500, 'An error has ocurred.', '', error)
      res.status(response.statusCode).send(response)
    })
  }

  @Delete('/:id', [
    new Authenticate([1, 2]) // We indacte wich Roles can access to this route and subroutes
    // It can be empty and all users will have access
  ])
  async delete(req, res) {
    this._service.delete(req.params.id).then(response => {
      res.status(response.statusCode).send(response)
    }).catch((error) => {
      let response = new ResultModel(500, 'An error has ocurred.', '', error)
      res.status(response.statusCode).send(response)
    })
  }

}


module.exports = UserController