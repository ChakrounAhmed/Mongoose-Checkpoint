const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = () => {
    mongoose.connect(
        process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        },
        (err) => {
            if (err) {
                console.log(err);
            } else console.log('database connected');
        }
    );
};
module.exports = connectDB;
