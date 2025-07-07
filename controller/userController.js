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
        const {fullName, username, email, userId, password} = validated

        // Check for existing user
        const user = await userModel.findOne({ email: email.toLowerCase()})
        if(user) {
            // Return existing user data (not recommended for production)
            return res.status(200).json({
                message: `user with email: ${email} already exists`,
                data: user
            });
        }

        // Hash password before saving
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            fullName,
            email,
            password,
            username,
            userId
        })

        const token = await jwt.sign({ userId: newUser._id}, process.env.JWT_SECRET, { expiresIn: '2day'})

        const link = `${req.protocol}://${req.get('host')}/verifyUser/${token}`

        const firstName = newUser.fullName.split(' ')[0]


        const mailDetails = {
            subject: 'Welcome Email',
            email: newUser.email,
            html : signUpTemplate(link, firstName)
        }

        await sendEmail(mailDetails)
        console.log('Mail has been sent');
        await newUser.save()

        res.status(201).json({message: 'user registered successfully', data: newUser })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error registering user',  error: error.message})
        
    }
}




exports.login = async (req, res) => {
    try {
        const validated = await validate(req.body , loginSchema)

        const {userId, password} = validated

        if (!userId || !password) {
            return res.status(400).json({ message: 'Please input both userId and password' });
        }

        const user = await userModel.findOne({ userId });
        if (!user) {
            return res.status(401).json({ message: 'Invalid userId or password' });
        }

        // Compare password as plain text
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid userId or password' });
        }


        if(user.isVerified === false) {
            return res.status(400).json({message: 'account not verified, please check your email for link'})  
        }


        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1day' });

        res.status(200).json({message: 'login successful', data: user, token})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error loging user' , error: error.message})
    }
}




exports.verifyUser = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'User verified successfully', data: user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying user', error: error.message });
    }
};

