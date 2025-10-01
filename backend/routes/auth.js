const express = require('express')
const { body } = require('express-validator')
const { validationResult } = require('express-validator')

const controllers = require('../controllers/auth')
const { default: next } = require('next')

const router = express.Router()

router.post('/auth/google', controllers.googleAuth)

router.post('/auth/github', controllers.gitHubAuth)

router.post('/signup', [
    body('email').isEmail().withMessage('please enter valid email').bail(),
    body('password').isLength({ min: 4 }).withMessage('password must four chars long').bail(),
    body('confirmPassword').isLength({ min: 4 }).withMessage('confirm password must contain four chars').bail().custom((val, { req }) => {
        if (val !== req.body.password) {
            throw new Error('password and confirm password must match')
        }
        return true;
    })
], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json({ iaValidationErrCame: true, errors: errors.array() })
    }
    next()
}, controllers.signup)

router.post('/login', controllers.login)

router.post('/reduxData', controllers.getReduxData)

router.post('/signout', controllers.signout)

router.post('/send-reset-email',
    [
        body('email').isEmail().withMessage('please enter valid email')
    ], (req, res) => {
        const erros = validationResult(req)
        if (!erros.isEmpty()) {
            return res.json({ iaValidationErrCame: true, errors: erros.array() })
        }
        next()
    }, controllers.sendResetEmail)

router.post('/reset-password',
    [
        body('password').isLength({ min: 4 }).withMessage('password must four chars long').bail(),
        body('confirmPassword').isLength({ min: 4 }).withMessage('confirm password must contain 4 chars').bail().custom((val, { req }) => {
            if (val !== req.body.password) {
                throw new Error('password and confirm password should match')
            }
        })
    ], (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({ iaValidationErrCame: true, errors: errors.array() })
        }
    }, controllers.resetPassword)


module.exports = router;