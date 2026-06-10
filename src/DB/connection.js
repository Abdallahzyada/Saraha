import mongoose from "mongoose";
import { DB_URI } from "../../Config/config.service.js";

const connectDB = async () => {
    console.log(DB_URI);
    
    try {
        await mongoose.connect(DB_URI,{
            serverSelectionTimeoutMS: 5000
        })
        console.log("DB connected");
        
    } catch (error) {
        console.log("DB connection failed");
        console.log(error);
        
        
    }
}
export default connectDB;