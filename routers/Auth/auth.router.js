const {Router} = require('express');
const {register, login} = require('../../controllers/Auth/auth.controller');
// const { registe = require('module');

const AuthRouter = Router();

AuthRouter.post('/register',register)
AuthRouter.post('/login',login)

module.exports = AuthRouter