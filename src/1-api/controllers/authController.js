import { Controller, Get, Post } from '@decorators/express'
import { UserService } from '../../2-services'
import { createToken } from '../../utils/createToken'
import randToken from 'rand-token'
import redis from '../../utils/redis'
import config from '../../config/config'
import { UserTokenModel } from '../../models/user'
import Authenticate from '../../utils/middlewares/Authenticate'
import { ResultModel } from '../../models/resultModel'


@Controller('/auth')
class AuthController {

  constructor() {
    this._userService = new UserService()
  }

  @Post('/login')
  async login(req, res) {
    try {
      let response = await this._userService.getUserForAuth(req.body)
      const user = response.body
      if (user) {
        const userModel = new UserTokenModel(user)
        const data = {
          id: userModel.id,
          email: userModel.email,
          role: userModel.role
        }
        const token = await createToken(userModel)
        const refreshToken = randToken.uid(256)
        const expiration = Math.floor(Date.now() / 1000) + config.JWT_REFRESH_EXPIRATION * 3600
        userModel.token = token
        userModel.refreshToken = refreshToken
        redis.set(refreshToken, JSON.stringify({ ...data, expiration }), redis.print)
        response = new ResultModel(200, 'Login successful.', userModel)
      }
      res.status(response.statusCode).send(response)
    } catch (error) {
      let response = new ResultModel(500, 'An error has ocurred.', '', error)
      res.status(response.statusCode).send(response)      
    }
  }

  @Post('/refresh')
  async refresh(req, res) {
    try {
      const { refreshToken } = req.body
      if (refreshToken) {
        redis.get(refreshToken, async(err, response) => {
          if (err) {
            const result = new ResultModel(403, 'Invalid Refresh token')
            res.status(result.statusCode).send(result)
          } else if (response) {
            const value = JSON.parse(response)
            if (value) {
              if (value.expiration >= Math.floor(Date.now() / 1000)) {
                const token = await createToken(value)
                const result = new ResultModel(200, 'Token refreshed', { token, refreshToken })
                res.status(result.statusCode).send(result)
              }
              const result = new ResultModel(403, 'Refresh token has expirated')
              res.status(result.statusCode).send(result)
            }
          } else {
            const result = new ResultModel(403, 'Invalid Refresh token')
            res.status(result.statusCode).send(result)
          }
        })
      } else {
        const result = new ResultModel(403, 'Invalid Refresh token')
        res.status(result.statusCode).send(result)
      }
    } catch (error) {
      let response = new ResultModel(500, 'An error has ocurred.', '', error)
      res.status(response.statusCode).send(response)      
    }
  }

  @Get('/validate', [
    new Authenticate()
  ])
  async validate(req, res) {
    return res.send(true)
  }

}


module.exports = AuthController