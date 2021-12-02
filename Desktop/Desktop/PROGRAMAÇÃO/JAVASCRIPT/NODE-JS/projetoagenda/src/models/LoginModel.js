// TUDO QUE É REFERENTE À BASE DE DADOS É O MODEL QUE VAI TRABALHAR

const mongoose = require('mongoose'); // ORM de MongoDB
const validator = require('validator') // framework de node instalado no npm install para validar senha
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
   email: {type: String, required: true},
   password: {type: String, required: true},
});

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
    constructor(body) {
        this.body = body; // aqui vamos ter disponivel o body em todos os métodos da classe
        this.errors = []; // se tiver algum erro não pode cadastrar o usuário na baser de dados
        this.user = null;
    }

    async login() {
        this.valida();
        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({email: this.body.email});

        if(!this.user) {
            this.errors.push('Usuário não existe')
            return;
        }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida')
            this.user = null
            return;
        }
    }

    // a partir do loginController, quando o método login.register for acionado, uma cadeia será executada a partir daqui
    async register(){
        this.valida();
        if(this.errors.length > 0) return;
        
        await this.userExists();

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        
        this.user = await LoginModel.create(this.body); //cria o usuário
    }

    async userExists() {
        this.user = await LoginModel.findOne({email: this.body.email});
        if (this.user) this.errors.push('Usuário já existe')
       
    }

    valida() {
        this.cleanUp();

        //Validação
        // o e-mail precisa ser válido
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')
        
        // a senha precisa ter entre 3 e 50 caracteres
        if(this.body.password.length < 3 || this.body.password > 50 ) {
            this.errors.push('a senha precisa ter entre 3 e 50 caracteres')
        }
    }

    cleanUp() {
        for(const key in this.body) {
         if  (typeof this.body[key] !== 'string') {
             this.body[key] = '';
         }
        }
        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;