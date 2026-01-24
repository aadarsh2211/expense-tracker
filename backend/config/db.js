const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('MongoDB connected successfully');
    }
    catch(err){
        console.error('MongoDB connection failed:', err.message);
        console.error('Full error:', err);
        process.exit(1);
    }
}; 
module.exports = connectDB;