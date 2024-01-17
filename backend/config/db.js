import mongoose from 'mongoose';

export const connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI,{
            dbName: process.env.DATABASE
        })
        console.log(`mongodb connected: ${conn.connection.host}`);
    }
    catch(error){
        console.error(error);
    }
}