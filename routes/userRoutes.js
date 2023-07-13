import express from "express";
import {authLogin,formLogin,formRegister,toRegister,formForgotPassword,resetPassword, confirmRegister,verifyToken,newPassword} from "../controllers/userController.js";
const router = express.Router();

/*Routing*/
router.get('/login',formLogin);
router.post('/login',authLogin);
router.get('/register',formRegister)
router.post('/register',toRegister)
router.get('/confirm/:token',confirmRegister)
router.get('/forgot-password',formForgotPassword)
router.post('/forgot-password',resetPassword)

router.get('/forgot-password/:token',verifyToken)
router.post('/forgot-password/:token',newPassword)

export default router