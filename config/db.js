const mongoose = require("mongoose");

const dotenv = require("dotenv")
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(
            `mongoDB connected`
        );
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;