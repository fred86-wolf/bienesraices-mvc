import nodemailer from 'nodemailer'

const emailRegister = async (data) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {name,email,token} = data

      await transport.sendMail({
        from:'BienesRaices.com',
        to:email,
        subject:'Confirma tu Cuenta en BienesRaices.com',
        text:'Confirma tu Cuenta en BienesRaices.com',
        html:`
            <p> Hola ${name}, comprueba tu cuenta en Bienesaices.com</p>

            <p> Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.BACK_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirmar Cuenta</a> </p>

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
      })
}

const emailForgotPassword = async (data) =>{
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const {name,email,token} = data

    await transport.sendMail({
      from:'BienesRaices.com',
      to:email,
      subject:'Restablece tu Contraseña en BienesRaices.com',
      text:'Restablece tu Contraseña en BienesRaices.com',
      html:`
          <p> Hola ${name}, has solicitado reestablecer tu contraseña en Bienesaices.com</p>

          <p> Sigue el siguiente enlace para generar una contraseña nueva
          <a href="${process.env.BACK_URL}:${process.env.PORT ?? 3000}/auth/forgot-password/${token}">Reestablecer Contraseña</a> </p>

          <p>Si tu no solicitaste el el cambio de contraseña, puedes ignorar el mensaje</p>
      `
    })
}


export {
    emailRegister,
    emailForgotPassword
}