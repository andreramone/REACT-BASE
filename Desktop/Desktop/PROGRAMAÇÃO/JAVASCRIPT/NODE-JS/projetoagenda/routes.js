const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const contatoController = require('./src/controllers/contatoController')

const { loginRequired } = require('./src/middlewares/middleware') //MIDDLEWARE CRIADO PARA FICAR NO MEIO DO CAMINHO E VERIFICAR SE O USUÁRIO ESTÁ LOGADO

// ROTAS DA HOME
route.get('/', homeController.index); //A ROUTE VAI DECIDIR QUAL CONTROLLER SERÁ UTILIZADO, QUEM VAI CONTROLAR AQUELA ROTA QUE NESSE CASO É O HOME CONTROLLER


//ROTAS DE LOGIN
route.get('/login/index', loginController.index)
route.post('/login/register', loginController.register) // ESSE POST VAI ENVIAR O CADASTRO DE LOGIN
route.post('/login/login', loginController.login) // ESSE POST VAI ENVIAR A INFORMAÇÃO QUE O USUÁRIO LOGOU
route.get('/login/logout', loginController.logout) 


// ROTAS DE CONTATO
route.get('/contato/index', loginRequired, contatoController.index) // O MIDDLEWARE DE LOGIN ESTÁ AQUI PARA VERIFICAR SE O USUÁRIO QUE TEM ACESSO AOS CONTATOS ESTÁ LOGADO
route.post('/contato/register', loginRequired, contatoController.register) // ESSE POST VAI ENVIAR AS INFORMAÇÕES CADASTRADAS NO CONTATO
route.get('/contato/index/:id', loginRequired, contatoController.editIndex) 
route.post('/contato/edit/:id', loginRequired, contatoController.edit) 
route.get('/contato/delete/:id', loginRequired, contatoController.delete) 


module.exports = route;
