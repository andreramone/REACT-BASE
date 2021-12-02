const Login = require("../models/LoginModel");

exports.index = (req, res) => {
  if(req.session.user) return res.render('login-logado')
  return res.render("login");
};

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body); // da onde vem o POST dos formulários, o rq.body vai ser preenchido com os dados do formulario
    await login.register();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors); //os erros vao ficar aqui
      // vamos redirecionar a pagina para o login e exibir a flash message

      //mas antes precisa salvar a sessão primeiro para garantir que a sessão vai ser salva depois retornar para o login
      req.session.save(function () {
        return res.redirect("back");
      });
      return;
    }
    req.flash("sucess", "seu usuário foi criado com sucesso.");
    req.session.save(function () {
      return res.redirect("back");
    });
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.login = async function (req, res) {
  try {
    const login = new Login(req.body); // USANDO A CLASSE DE LOGIN
    await login.login(); // A GENTE PEDE PRA FAZER O LOGIN

    // SE ACONTECER ALGUM ERRO VAI SER TRATADO AQUI
    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        //mas antes precisa salvar a sessão primeiro para garantir que a sessão vai ser salva depois retornar para o login
        return res.redirect("back"); // vamos redirecionar a pagina para o login e exibir a flash message
      });
      return;
    }

    req.flash("sucess", "Você entrou no sistema.");
    req.session.user = login.user; //vai criar uma sessaão que serve pra identificar o seu navegador utlizado como o seu navegador
    // vai salvar a sessão
    req.session.save(function () {
      return res.redirect("back");
    });
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.logout = function(req,res) {
  req.session.destroy();
  res.redirect('/')
}