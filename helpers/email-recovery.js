const transporter = require("nodemailer").createTransport(require("../config/email")); //transportador usando as configurações de email da pasta config email
const {api: link} = require("../config/index");

module.exports = ({usuario, recovery}, cb) => {
    const message = `
        <h1 style="text-align: center;">Recuperação de Senha</h1>
        <br/>
        <p>
            Aqui está o link para redefinir sua senha. Acesse-o e digite sua nova senha:
        </p>
        <a href="${link}/v1/api/usuarios/senha-recuperada?token=${recovery.token}">
            ${link}/v1/api/usuarios/senha-recuperada?token=${recovery.token}
        </a>
        <br /><br /><hr />
        <p>
        Obs: Se você não solicitou a redefinição de senha, por favor, apenas ignore este email.
        </p>
        <br />
        <p>Atenciosamente, nome da loja </p>
    `;

    const opcoesEmail = {
        from: "naoresponder@gmail.com",
        to: usuario.email,
        subject: "Redefinição de Senha - Nome da loja",
        html: message
    }

    if(process.env.NODE_ENV === "production"){
        transporter.sendMail(opcoesEmail, (error,info) => {
            if(error){
                console.log(error);
                return cb("Aconteceu um erro no envio do email, tente novamente.");
            }
            else{
                return cb(null, "Link para redefinição de senha enviado com sucesso");
            }
        })
    } else{
        console.log(opcoesEmail);
        return cb(null, "Link para redefinição de senha enviado com sucesso");
    }
};