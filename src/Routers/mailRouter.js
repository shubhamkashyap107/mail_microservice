const express = require("express")
const router = express.Router()
const nodemailer = require("nodemailer")
const rateLimit = require("express-rate-limit");
require("dotenv").config()



const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 465,
  secure: true,  // Use 'false' if using port 587
  auth: {
    user: process.env.emailID,  
    pass: process.env.password  
  }
});




const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3,
    message: {
        status: 429,
        message: "Too many OTP requests from this IP. Please try again after 10 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});


router.get("/:receiverId/otp" ,(req, res) => {

    // console.log(process.env.emailID,process.env.password)
    try {
        
    const OTP = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    const receiverMail = req.params.receiverId

    const mailOptions = {
        from: "shubham@noisy.co.in",
        to: receiverMail,
        subject: "🚨 Your Noisy OTP is Here!",
        html: `
          <div style="max-width: 500px; margin: auto; background: #111827; color: #F9FAFB; font-family: 'Segoe UI', sans-serif; border-radius: 12px; overflow: hidden; box-shadow: 0 0 30px rgba(0,0,0,0.3);">
            <div style="background: linear-gradient(to right, #6366F1, #EC4899); padding: 24px 32px;">
              <h1 style="margin: 0; font-size: 24px; color: #fff;">🔐 Noisy Security</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #E0E7FF;">Your OTP has arrived in style.</p>
            </div>
            <div style="padding: 32px;">
              <p style="margin: 0 0 16px;">Hey there 👋,</p>
              <p style="margin: 0 0 24px;">Here’s your one-time password (OTP):</p>
              <div style="background: #1F2937; padding: 20px; border-radius: 10px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #10B981;">
                ${OTP}
              </div>
              <p style="margin: 24px 0 8px; font-size: 14px;">This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">If you didn’t request this, you can safely ignore this email.</p>
            </div>
            <div style="background: #1F2937; padding: 16px; text-align: center; font-size: 12px; color: #6B7280;">
              &copy; ${new Date().getFullYear()} Noisy Inc. | Secure. Simple. Slick.
            </div>
          </div>
        `
      }
      
      

    transporter.sendMail(mailOptions, (err, info) => {
        if(err)
        {
            console.log("Email Error : " + err)
            return res.status(500).json({"message" : "Failed"})
        }
        // console.log(info)
        res.status(200).json({"message" : "Successful", "otp" : OTP})
    })
    } catch (error) {
        res.status(401).json({"message" : "Something went Wrong"})
    }

})


router.post("/reminder", async(req, res) => {
  try {

    const {incomingRequests, receiverId} = req.body

    const mailOptions = {
      from: process.env.emailID,
      to: receiverId,
      subject: "🚀 New Connection Requests! Don't Miss Out!",
      html: `
        <div style="font-family: 'Arial', sans-serif; background-color: #f0f8ff; padding: 40px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);">
    
            <h2 style="font-size: 28px; color: #0077cc; text-align: center; font-weight: bold; margin-bottom: 20px;">
              🎉 You've Got New Connection Requests!
            </h2>
    
            <p style="font-size: 16px; color: #333; text-align: center; margin-bottom: 25px;">
              Hey! Some amazing people want to connect with you. Check out who's waiting:
            </p>
    
            <div style="font-size: 18px; color: #0077cc; font-weight: bold; text-align: center; margin-bottom: 25px;">
              ${incomingRequests
                .map(
                  name => `
                    <p style="margin: 8px 0;">👤 ${name}</p>
                  `
                )
                .join("")}
            </div>
    
            <div style="text-align: center;">
              <a href="https://noisy.co.in" style="background-color: #0077cc; color: #ffffff; padding: 12px 25px; border-radius: 50px; font-size: 16px; text-decoration: none; display: inline-block; font-weight: bold; transition: background-color 0.3s ease;">
                🚀 View Requests
              </a>
            </div>
    
            <hr style="border: none; border-top: 3px solid #0077cc; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #666; text-align: center;">
              This is an automated message from <strong>Noisy</strong>. Please don't reply.
            </p>
          </div>
        </div>
      `
    };
    


    await transporter.sendMail(mailOptions)
    return res.status(200).json({message : "Successful"})
  } catch (error) {
    console.log(error)
    return res.status(401).json({message : "Something went Wrong"})
  }
})



module.exports = {
    mailRouter : router
}