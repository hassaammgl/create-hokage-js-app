import mongoose from "mongoose";
const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
export const connectDb = async () => {
    try {
        await mongoose.connect(URI, {
            dbName: process.env.DB_NAME || 'api1',
        });
        console.log('connected to db');
    } catch (err) {
        console.log(err);
    }
}