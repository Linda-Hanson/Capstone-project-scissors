const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const User = require("../models/user");

//@desc     Get user data
//@route    GET /api/users/me
//@access   private
const getMe = asyncHandler(async (req, res) => {
    const { _id, name, email, ssn } = await User.findById(req.user.id);

    return res.status(200).json({
        id: _id,
        name: name,
        email: email,
        ssn: ssn
    });
});

//@desc     Authenticate a user
//@route    GET /api/users/login
//@access   public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password,user.password))) {
        // const isMatch = await user.isValidPassword(password);
        // return isMatch
          //? done(null, user)
        //   : done(null, false, { message: 'Incorrect password' });
        return res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error("Invalid credentials");
    }
});

//@desc     Register user
//@route    GET /api/users
//@access   public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
     console.log(name, email, password);

    if (!name || !email || !password) {
        //ssn optional
        res.status(404);
        throw new Error("Please add all fields");
    }

    //find user by email
    const userExists = await User.findOne({ email });
     console.log(userExists)
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    
    //Hash Password
    // const salt = await bcrypt.genSalt(10);
    //    console.log(salt)
    // const hashedPassword = await bcrypt.hash(password, salt);
    // console.log(hashedPassword)

    //Create User
    const user = await User.create({
        name,
        email,
        password: password,
     
    });

    if (user) {
        return res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            password: user.password
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

module.exports = {
    registerUser,
    getMe,
    loginUser
};