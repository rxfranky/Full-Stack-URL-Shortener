const { OAuth2Client } = require('google-auth-library')
const UserModel = require('../models/signup')
const LoggedInUserModel = require('../models/loggedIn')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const ReduxDataModel = require('../models/reduxStore')
const sgMail = require('@sendgrid/mail')
const crypto = require('node:crypto')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.googleAuth = async (req, res) => {
    const id_token = req.body.idToken;

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID
    })

    if (ticket.getPayload()) {
        const payload = ticket.getPayload()

        const newUser = {
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        }

        const isFoundInLoggedInUsers = await LoggedInUserModel.findOne({ email: payload.email })
        if (isFoundInLoggedInUsers) {
            return res.json({ isAlreadyLoggedIn: true })
        } else {
            const newLoggedInUser = new LoggedInUserModel({
                email: payload.email
            })
            const savedUserInLoggedInUsersModel = await newLoggedInUser.save()
            console.log('savedUserInLoggedInUsersModel-', savedUserInLoggedInUsersModel)

            const newReduxData = new ReduxDataModel({
                email: payload.email,
                isLoggedIn: true,
                userData: newUser
            })

            const newSavedReduxStoreData = await newReduxData.save()
            console.log('newSavedReduxStoreData-', newSavedReduxStoreData)

            const isFoundInUsers = await UserModel.findOne({
                email: payload.email,
                provider: 'google'
            })

            if (isFoundInUsers) {
                const token = jwt.sign({ email: payload.email }, process.env.JWT_SECRET)
                return res.json({ user: newUser, token, isLoggedIn: true })
            } else {
                const user = new UserModel({
                    email: payload.email,
                    name: payload.name,
                    provider: 'google',
                    picture: payload.picture
                })
                const savedUser = await user.save()
                console.log('savedUserInUsersModel-', savedUser)

                const token = jwt.sign({ email: payload.email }, process.env.JWT_SECRET)

                return res.json({ user: newUser, token, isLoggedIn: true })
            }
        }
    } else {
        return res.json({ msg: 'invalid google token!' })
    }

}

exports.gitHubAuth = async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const image = req.body.image;

    const isFound = await LoggedInUserModel.findOne({ email: email })

    if (isFound) {
        return res.json({ isAlreadyLoggedIn: true })
    } else {
        const newLoggedInUser = new LoggedInUserModel({
            email: email
        })
        const savedUserInLoggedInUsersModel = await newLoggedInUser.save()
        console.log('savedUserInLoggedInUsersModel-', savedUserInLoggedInUsersModel)

        const isFoundInUsers = await UserModel.findOne({ email: email, provider: 'github' })

        if (isFoundInUsers) {
            return res.json({ isAlreadyLoggedIn: false })
        } else {
            const newUser = new UserModel({
                email: email,
                name: name,
                provider: 'github',
                picture: image
            })
            const savedUserWithGithub = await newUser.save()
            console.log('savedUserWithGithub-', savedUserWithGithub)

            return res.json({ isAlreadyLoggedIn: false })
        }
    }
}


exports.signup = async (req, res) => {
    const data = req.body;

    const users = await UserModel.find({ email: data.email })

    const isFoundUserWithEmailPass = users.find(user => user.provider == undefined)

    if (isFoundUserWithEmailPass) {
        return res.json({ alreadySignedUpWithEmailPass: true })
    }

    const hassedPassword = bcrypt.hashSync(data.confirmPassword, 12)

    const newUser = new UserModel({
        email: data.email,
        name: data.name,
        password: hassedPassword
    })
    const savedUserWithEmailAndPass = await newUser.save()
    console.log("savedUserWithEmailAndPass-", savedUserWithEmailAndPass)

    const sgRes = await sgMail.send({
        from: 'sahidafridi0076@gmail.com',
        to: data.email,
        subject: 'Welcome to our community',
        html: '<span>its been a pleasure! Great to see you ahead.</span>'
    })
    console.log('sent mail to new user-', sgRes)

    return res.json({ isSignedUpSuccess: true })
}


exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const isFoundInLoggedInUsers = await LoggedInUserModel.findOne({ email: email })
    if (isFoundInLoggedInUsers) {
        return res.json({ isAlreadyLoggedIn: true })
    }

    const users = await UserModel.find({ email: email })

    const filteredUser = users.filter((user) => (user.provider !== 'google' && user.provider !== 'github'))

    console.log('filteredUser-', filteredUser)

    const isPasswordMatch = bcrypt.compareSync(password, filteredUser[0].password)

    if (isPasswordMatch) {
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET)

        const newLoggedInUser = new LoggedInUserModel({
            email: email
        })
        const savedUserInLoggedInUsersModel = await newLoggedInUser.save()
        console.log('savedUserInLoggedInUsersModel-', savedUserInLoggedInUsersModel)

        const newReduxData = new ReduxDataModel({
            email: email,
            isLoggedIn: true,
            userData: { name: filteredUser[0].name, email: filteredUser[0].email }
        })

        const newSavedReduxStoreData = await newReduxData.save()
        console.log('newSavedReduxStoreData-', newSavedReduxStoreData)

        return res.json({ token, user: { name: filteredUser[0].name, email: filteredUser[0].email }, isLoggedIn: true })
    }
    return res.json({ isIncorrectPassword: true })
}


exports.getReduxData = async (req, res) => {
    const email = req.body.email;

    const data = await ReduxDataModel.findOne({ email: email });

    return res.json({ isLoggedIn: data.isLoggedIn, user: data.userData })
}


exports.signout = async (req, res) => {
    const email = req.body.email;

    const deletedDocFromLoggedIn = await LoggedInUserModel.findOneAndDelete({ email: email })
    console.log('deletedDocFromLoggedIn-', deletedDocFromLoggedIn)
    const deletedDocFromRedux = await ReduxDataModel.findOneAndDelete({ email: email })
    console.log('deletedDocFromRedux-', deletedDocFromRedux)

    return res.json({ isSignoutSuccess: true })
}


exports.sendResetEmail = async (req, res) => {
    const email = req.body.email;

    const token = crypto.randomBytes(10).toString('hex')

    const isFound = await UserModel.findOneAndUpdate({ email: email, provider: undefined }, { token: token, resetTokenExp: (Date.now()) + 36000000 })

    if (!isFound) {
        return res.json({ msg: 'entered email does&apos;t exists!' })
    }
    const sgRes = await sgMail.send({
        from: 'sahidafridi0076@gmail.com',
        to: email,
        subject: 'Reset Password',
        html: `<span>reset link-</span> <a href=http://localhost:3000/reset-password/${token}>click here</a>`
    })
    console.log('sg res-', sgRes)

    if (sgRes[0].statusCode == 202) {
        return res.json({ isEmailSent: true })
    }

    return res.json({ isEmailSent: false })
}


exports.resetPassword = async (req, res) => {
    const token = req.header('token');
    const confirmPassword = req.body.confirmPassword

    const hassedPassword = bcrypt.hashSync(confirmPassword, 12)
    const foundUser = await UserModel.findOne({ token: token })
    if (!foundUser) {
        return res.json({ msg: 'invalid token' })
    } else {
        const resetTokenExp = foundUser.resetTokenExp
        if (resetTokenExp < Date.now()) {
            return res.json({ msg: 'token expired!' })
        } else {
            const updatedUser = await UserModel.findOneAndUpdate({ token: token }, { token: null, resetTokenExp: null, password: hassedPassword })
            console.log('updatedPassUser-', updatedUser)
            return res.json({ isPasswordUpdateSuccess: true })
        }
    }
}