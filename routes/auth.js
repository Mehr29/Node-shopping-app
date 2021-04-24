const express = require('express');
const {check,body}=require('express-validator/check')
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login',[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ], authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', 
[
    check('email').isEmail().withMessage('Enter a valid email bruhh!'),
    body('password','Enter a lowercased password with at least 5 characters').isLength({min:5}).isLowercase(),
    body('confirmPassword').custom((value,{req})=>{
        if(value!== req.body.password)
        throw new Error('Passwords need to match!')

        return true
    })
] ,authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset',authController.getReset);

router.post('/reset',authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);
module.exports = router;