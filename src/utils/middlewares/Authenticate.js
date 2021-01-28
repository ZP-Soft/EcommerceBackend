/**
 * EN: Middleware in charge of validate the user's token
 * ES: Middleware encargado de validar el token del usuario
 */
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import config from '../../config/config'

class Authenticate {

  constructor(roles) {
    this.roles = roles || []
  }

  async validateAccessToken(req) {
    try {
      const token = await this.extractToken(req)
      if (token) {
        try {
          const decoded = jwt.verify(token, config.JWT_SECRET)
          if (!decoded) throw createError(401, 'Token invalido')
          const user = { id: decoded.data.id, email: decoded.data.email, role: decoded.data.role }
          return user
        } catch {
          throw createError(401, 'You must log in')
        }
      }
      else {
        throw createError(401, 'You must log in')
      }
    } catch (error) {
      throw createError(401, 'You must log in')
    }
  }

  async validatePermission(user) {
    try {
      if (user) {
        try {
          let hasPermission = true
          if (this.roles.length > 0) {
            hasPermission = this.roles.indexOf(user.role) >= 0
          }
          if (user.role === 1) hasPermission = true 
          if (!hasPermission) {
            throw createError(403, 'You haven\'t got permissions for this action')
          }
          return true
        } catch {
          throw createError(403, 'You haven\'t got permissions for this action')
        }
      }
      else {
        throw createError(403, 'You haven\'t got permissions for this action')
      }
    } catch (error) {
      throw createError(403, 'You haven\'t got permissions for this action')
    }
  }

  async use(req, res, next) {
    try {
      const user = await this.validateAccessToken(req)
      req.user = user
      await this.validatePermission(user)
      next()
    } catch (e) {
      return next(e)
    }
  }

  async extractToken(request) {
    const authorization = request.headers['authorization'] || req.query.token || req.body.token,
          token = authorization && authorization.replace('Bearer ', '')
    return token
  }

}

module.exports = Authenticate
