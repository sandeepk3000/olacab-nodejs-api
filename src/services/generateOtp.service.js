import crypto from "crypto"
const generateOtp = (length)=>{
    try {
        const otp = crypto.randomInt(Math.pow(10,length-1),Math.pow(10,length)).toString()
        return otp
    } catch (error) {
        
    }
}

export default generateOtp