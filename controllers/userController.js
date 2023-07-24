import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { generateId,generateJWT } from '../helpers/tokens.js'
import { emailRegister,emailForgotPassword } from '../helpers/emails.js'

const authLogin = async (req,res) => {

    await check('email').isEmail().withMessage('Email invalido').run(req)
    await check('password').notEmpty({min:6}).withMessage('La Contraseña es Obligatoria').run(req)

    let result = validationResult(req)

    if(!result.isEmpty()){
        return res.render('auth/login',{
            page:'Iniciar Sesión',
            csrfToken:req.csrfToken(),
            errors: result.array(),
        })
    }

    const {email, password} = req.body
    /**User exist */
    const user = await User.findOne({where:{email}})
    if (!user) {
        return res.render('auth/login',{
            page:'Iniciar Sesión',
            csrfToken:req.csrfToken(),
            errors: [{msg:'El Usuario No Existe'}],
        })
    }

    /**Confirm account */
    if (!user.confirm) {
        return res.render('auth/login',{
            page:'Iniciar Sesión',
            csrfToken:req.csrfToken(),
            errors: [{msg:'El Usuario no ha sido Confirmado'}],
        })
    }

    if (!user.verifyPassword(password)) {
        return res.render('auth/login',{
            page:'Iniciar Sesión',
            csrfToken:req.csrfToken(),
            errors: [{msg:'Correo o Contraseña invalido'}],
        })
    }

    /**JWT */

    const token = generateJWT(user.id)


    return res.cookie('_token',token,{
        httpOnly:true,
        /*secure:true,
        sameSite:true*/
    }).redirect('/your-properties')


}

const formLogin = (req,res) =>{
    res.render('auth/login',{
        page:'Iniciar Sesión',
        csrfToken:req.csrfToken()
    })
}


const logOut = (req,res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

const formRegister = (req,res) =>{
    res.render('auth/register',{
        page:'Crear Cuenta',
        csrfToken:req.csrfToken()
    })
}

const toRegister = async (req,res) =>{
    /** Validation */
    await check('name').notEmpty().withMessage('El nombre no puede ir vacío').run(req)
    await check('email').isEmail().withMessage('Email invalido').run(req)
    await check('password').isLength({min:6}).withMessage('Debe ser de al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req)

    const {name,email,password} = req.body;


    let result = validationResult(req)

    /** Verify user is empty */
    if(!result.isEmpty()){
        return res.render('auth/register',{
            page:'Crear Cuenta',
            csrfToken:req.csrfToken(),
            errors: result.array(),
            user:{
                name,
                email
            }
        })
    }

    const isUserExist = await User.findOne({where: {email}})
    if (isUserExist) {
        return res.render('auth/register',{
            page:'Crear Cuenta',
            csrfToken:req.csrfToken(),
            errors: [{msg:'El Usuario ya esta Registrado'}],
            user:{
                name,
                email
            }
        })
    }

    const user = await User.create({
        name,email,password,token:generateId()
    })

    /**Send Email */
    emailRegister({
        name:user.name,
        email:user.email,
        token:user.token
    })



    res.render('templates/message',{
        page:'Cuenta Creada Correctamente',
        msg:'Hemos Enviado un Email de Confirmación al Email'
    })

}

const confirmRegister = async (req,res) => {
    const {token} = req.params;

    /**Verify account */

    const user = await User.findOne({where:{token}})
    
    if (!user) {
        return res.render('auth/confirm-account',{
            page:'Error al confirmar tu Cuenta',
            msg:'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error:true
        })
    }

    /**Confirm account */

    user.token = null
    user.confirm = true
    await user.save();

    return res.render('auth/confirm-account',{
        page:'Cuenta confirmada',
        msg:'La Cuenta se confirmó Corectamente',
    })

}

const formForgotPassword = (req,res) =>{
    res.render('auth/forgot-password',{
        page:'Recupera tu acceso a Bienes Raices',
        csrfToken:req.csrfToken()
    })
}

const resetPassword = async (req,res) => {

    await check('email').isEmail().withMessage('Email invalido').run(req)

    let result = validationResult(req)

    if(!result.isEmpty()){
        return res.render('auth/forgot-password',{
            page:'Recupera tu acceso a Bienes Raices',
            csrfToken:req.csrfToken(),
            errors:result.array()
        })
    }

    /** Search User */

    const {email} = req.body;
    const user = await User.findOne({where:{email}})
    if(!user){
        return res.render('auth/forgot-password',{
            page:'Recupera tu acceso a Bienes Raices',
            csrfToken:req.csrfToken(),
            errors:[{msg:'El Email no Pertenece a ningun Usuario'}]
        }) 
    }

    /**Generate token and send email */

    user.token = generateId();
    await user.save();

    emailForgotPassword({
        email:user.email,
        name: user.name,
        token:user.token
    })

    res.render('templates/message',{
        page:'Reestablece tu Contraseña',
        msg:'Hemos enviado un emal con las instrucciones'
    })
}

const verifyToken = async (req,res) => {

    const { token } = req.params;

    const user = await User.findOne({where:{token}})

    if (!user) {
        return res.render('auth/confirm-account',{
            page:'Reestablece tu Contraseña',
            msg:'Hubo un error al validar tu información, Intenta de nuevo',
            error:true
        })
    }

    /**Form update password */
    res.render('auth/reset-password',{
        page:'Reestablece tu Contraseña',
        csrfToken:req.csrfToken()
    })

}

const newPassword = async (req,res) => {
    /**Verify Password */
    await check('password').isLength({min:6}).withMessage('Debe ser de al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req)

    let result = validationResult(req)


    if (!result.isEmpty()) {
        return res.render('auth/reset-password',{
            page:'Reestablece tu Contraseña',
            csrfToken:req.csrfToken(),
            errors: result.array()
        })
    }

    const {token} = req.params
    const {password} = req.body

    const user = await User.findOne({where:{token}})

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.token = null;

    await user.save();

    res.render('auth/confirm-account',{
        page:'Contraseña Reestablecida',
        msg:'La Contraseña se Guardó Correctamente'
    })

}

export {
    authLogin,
    logOut,
    formLogin,
    formRegister,
    toRegister,
    confirmRegister,
    formForgotPassword,
    resetPassword,
    verifyToken,
    newPassword
}