class UserModel {

  constructor(entity) {
    this.id = entity.id
    this.firstName = entity.firstName
    this.lastName = entity.lastName
    this.email = entity.email,
    this.role = entity.role,
    this.createdAt = entity.createdAt
    this.isEnabled = entity.isEnabled
  }

}

class UserTokenModel {

  constructor(entity) {
    this.id = entity.id
    this.firstName = entity.firstName
    this.lastName = entity.lastName
    this.email = entity.email,
    this.role = entity.role
  }

}


module.exports = {
  UserModel: UserModel,
  UserTokenModel: UserTokenModel
}