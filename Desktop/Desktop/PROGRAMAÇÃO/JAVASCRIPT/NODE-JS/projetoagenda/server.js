require('dotenv').config(); // variaveis de ambiente configuradas no arquivo .env que contem usuario senha do BD

const express = require('express'); 
const app = express(); //INICIA O EXPRESS
const mongoose = require('mongoose'); //MONGOOSE É UM ORM QUE VAI MODELAR A BASE DE DADOS E GARANTIR QUE OS DADOS SALVOS SÃO DA MESMA FORMA DESEJADA

mongoose.connect('mongodb+srv://andreramone:answer@aulajs.3aqen.mongodb.net/AGENDA?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}) //retorna uma promessa e os objetos são erros que geraram no node
.then(() => {
    app.emit('pronto'); // VAI EMITIR O EVENTO QUE O APP ESTA PRONTO
})
.catch(e => console.log(e));

const session = require('express-session') // PARA IDENTIFICAR O NAVEGADOR DE UM CLIENTE, SALVAR UM COOKIE COM UM ID E TODA VEZ QUE ELE CONECTAR NO SERVIDOR ELE VAI ENVIAR ESSE COOKIE, E IDENTIFICAR QUE O CLIENTE JA CONECTOU ANTERIORMENTE
const MongoStore = require('connect-mongo'); // AS SEÇÕES VAO SER SALVAS DENTRO DA BASE DE DADOS PQ POR PADRAO ELAS SAO SALVAS EM MEMORIA
const flash = require('connect-flash') // FLASH MESSAGES, MENSAGENS AUTO-DESTRUTIVAS.. P MANDAR MSG DE ERRO DE FEEDBACK PARA OS USUÁRIOS E SÃO SALVAS EM SESSÃO SESSION
const routes = require('./routes') // ROTAS DA NOSSA APLICAÇÃO /HOME /CONTATO /PAGINAINICIAL
const path = require('path') //CAMINHOS
// const helmet = require('helmet') // DEIXA A APLICACAO MAIS SEGURA
const csrf = require('csurf') // SEGURANÇA EMITE UM CSRF TOKEN EM QUE TODOS OS FORMULARIOS TEM QUE TER PARA QUE NENHUM SITE EXTERNO CONSIGA POSTAR COISAS PRA DENTRO DA NOSSA APLICACAO
const {middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middleware'); // MIDDLEWARES SAO FUNCOES QUE SAO EXECUTADAS NA ROTA, NO MEIO DO CAMINHO DAS ROTAS.


// app.use(helmet()) 
app.use(express.urlencoded({extended: true})); //PODEMOS POSTAR FORMULARIOS PARA DENTRO DA APLICACAO
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public'))); //SAO TODOS OS ARQUIVOS QUE SÃO ESTÁTICOS E DEVEM SER ACESSADOS DIRETAMENTE NA NOSSA APLICACAO

// CONFIGURAÇÕES DE SESSÃO
const sessionOptions = session({
    secret: 'dasdasdasdas+++',
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://andreramone:answer@aulajs.3aqen.mongodb.net/AGENDA?retryWrites=true&w=majority'}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
        httpOnly: true
    },
});

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views')) // INDICA O CAMINHO DE ARQUIVOS QUE SERÃO RENDERIZADOS NA TELA GERALMENTE SAO ARQUIVOS HTML
app.set('view engine', 'ejs') // ENGINE QUE UTILIZAMOS PARA RENDERIZAR O HTML

app.use(csrf());

// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes); // CHAMANDO ROTAS

app.on('pronto', () => { // VAI ESCUTAR O EVENTO E OUVIR REQUISIÇÕES
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000');
        console.log('Servidor executando na porta');
    });
});