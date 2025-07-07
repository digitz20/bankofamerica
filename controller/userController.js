const userModel = require('../model/user')
// const bcrypt  = require('bcryptjs')
const sendEmail = require('../middlewares/nodemailer')
// const jwt = require('jsonwebtoken')
const bcrypt  = require('bcrypt')
const jwt =require('jsonwebtoken')
const { signUpTemplate ,forgotTemplate } = require('../utils/mailTemplates')
const {validate} = require('../helper/utilities')
const {registerSchema, loginSchema, verificationEmailSchema, forgotPasswordSchema, resetPasswordschema, changePassword} = require('../validation/user')



exports.register = async (req, res) => {
    try {
        
        let validated;
        try {
            validated = await validate(req.body, registerSchema);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }
        
        const {fullName,userId, username, email, password} = validated

        if(!password) {
            return res.status(400).json({message: 'password is required'})
        }

        const user = await userModel.findOne({ email: email.toLowerCase()})

        if(user) {
            return res.status(400).json({message: `user with email: ${email} already exists`})
        }


        const newUser = new userModel({
            fullName,
            userId,
            email,
            password,
            username
            
        })


        const token = await jwt.sign({ userId: newUser._id}, process.env.JWT_SECRET, { expiresIn: '2day'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`

        const firstName = newUser.fullName.split(' ')[0]


        const mailDetails = {
            subject: 'Welcome Email',
            email: newUser.email,
            html : signUpTemplate(link, firstName)
        }

        await sendEmail(mailDetails)

        await newUser.save()

        res.status(201).json({message: 'user registered successfully', data: newUser })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error registering user',  error: error.message})
        
    }
}




exports.login = async (req, res) => {
    try {

        const {userId, password} = req.body
        if(!userId || !password) {
            return res.status(400).json({message: 'Please input both userId and password'})
        }



        
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error loging user' , error: error.message})
    }
}


