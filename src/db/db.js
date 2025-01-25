import  mongoose from "mongoose";
import conf from "../conf/conf.js";

const connectToDB = async()=>{
    try {
        const connectionInstence =await mongoose.connect(conf.mongodbUrl)
        
    } catch (error) {
        console.log("connection error ",error);
        process.exit(1)
        
    }
}
export default connectToDB;