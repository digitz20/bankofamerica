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
        const {fullName, username, email, userID, password} = validated

        // Check for existing user
        const user = await userModel.findOne({ email: email.toLowerCase()})
        if(user) {
            // Return existing user data (not recommended for production)
            return res.status(200).json({
                message: `user with email: ${email} already exists`,
                
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
            userID,
            isVerified: true // Mark user as verified on registration
        })

        // Optionally, you can skip sending the verification email if not needed
        // await sendEmail(mailDetails)
        // console.log('Mail has been sent');
        await newUser.save()

        // Generate JWT token for the new user
        const token = jwt.sign({ userID: newUser.userID }, process.env.JWT_SECRET, { expiresIn: '1day' });
        res.status(201).json({message: 'user registered successfully', data: newUser, token })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error registering user',  error: error.message})
        
    }
}




exports.login = async (req, res) => {
    try {
        const validated = await validate(req.body , loginSchema)
        const {userID, email, password} = validated
        if ((!userID && !email) || !password) {
            return res.status(400).json({ message: 'Please input userID or email and password' });
        }
        // Find user by userID or email, and only if verified
        let user;
        if (userID) {
            user = await userModel.findOne({ userID, isVerified: true });
        } else if (email) {
            user = await userModel.findOne({ email: email.toLowerCase(), isVerified: true });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials or account not verified' });
        }
        // Compare password as plain text (not secure)
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid userID/email or password' });
        }
        const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, { expiresIn: '1day' });
        res.status(200).json({message: 'login successful', data: user, token})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error logging user' , error: error.message})
    }
}




exports.verifyUser = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = decoded.userID;

        const user = await userModel.findById(userID);
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

