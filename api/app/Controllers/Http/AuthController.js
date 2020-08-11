'use strict'
const Hash = use('Hash')
// const Mail = use('Mail')
const Database = use('Database')
const User = use('App/Models/User')

class AuthController {

  // POST
  async register({request, response, auth}) {
    const transition = await Database.beginTransaction()
    try {
      let user = await User.create(request.all())
      await auth.login(user)
      await transition.commit()
      const { email, name, username } = user;
      return response.status(201).json({name, email, username})
    } catch (e) {
      await transition.rollback()
      return response.status(500).json({message: 'Erro ao cadastrar o usuário. Caso o erro persista, entre em contato com o Administrador.'})
    }
  }

  async login({request, response, auth}) {

    const {email, password} = request.all()
    try {
      await auth.attempt(email, password)
      const user = await auth.getUser()
      const { name, username } = user;
      return response.status(201).json({name, email, username})
    } catch (error) {
      return response.status(401).json({message: 'O e-mail ou senha estão incorretos.'})
    }
  }

  async logout({request, response, auth}) {
    try {
      const isLogged = await auth.check()
      if (isLogged) {
        await auth.logout();
      }
      return response.status(201).json({message: 'Usuário deslogado.'})
    } catch (error) {
      return response.status(401).json({message: 'Não há usuário autenticado.'})
    }


  }


}

module.exports = AuthController
