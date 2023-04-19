import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import { User } from "../models/users.js";
import cloudinary from "cloudinary";
import fs from "fs"


export const register = async (req,res)=>{
 
    try {
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password


        
        const avatarTempFilePath = req.files.avatar.tempFilePath;

        

        let user = await User.findOne({email});
      
        if(user){
            return res // return is neccesory, if we dont write return then below 
            // code will execute
            .status(400) // its code of error, 400 defines that it is error
            .json({success:false, message: "User already exists"});
        }

    const otp = Math.floor(Math.random()*100000);
    
    //it will from random otp

    const mycloud = await cloudinary.v2.uploader.upload(avatarTempFilePath,{
        folder: "todoApp",
    })
    
    console.log(mycloud)

    fs.rmSync("./tmp", { recursive: true});
    // if i put just fs.rmSync("./tmp") it wont delete
    // but if i put fs.rmSync("./tmp", { recursive: true })
    // it will everything from tmp file
    // because we dont want these files should remain after uplaoding to the cloud

    user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: mycloud.public_id,
            url: mycloud.secure_url
        },
        otp,
        otp_expiry:new Date(Date.now() + process.env.OTP_EXPIRE*60*1000 )});    
        // if process.env.OTP_EXPIRE is 5 the it will take 5 min 
        // and after 5 min otp will expire
        // 5*60*1000:- 5 min 60 sec 1000 milisec
        // if you havnt verified your otp within 5 min
        // you account will be deleted

    await sendMail(email, "Verify your account", `Your otp is ${otp}`);

 
    sendToken(res,user,201,"OTP sent to your email, Please verify Your account")
   
    await user.save();

    } catch (error) {
        res
        .status(500)
        .json({success: false, message: error.message});
    }
};

export const verify = async (req, res) => {
    try {
        const otp = Number(req.body.otp);
        console.log(req.body)
        const user = await User.findById(req.user._id)
        if(user.otp !== otp || user.otp_expiry < Date.now()){
            return res.status(400).json({ success: false, message: "Invalid OTP"});
        }

        user.verified = true;
        user.otp = null;
        user.otp_expiry = null;

        await user.save();
        sendToken(res, user, 200, "Account Verified");
        
    } catch (error) {
        res
        .status(500)
        .json({success: false, message: error.message});
    }
}

export const login = async (req,res)=>{
 
    try {
        const email = req.body.email;
        const password = req.body.password;

        if(!email || !password){
            return res
              .status(400)
              .json({ success: false, message: "Please enter all fields"});
        }

        const user = await User.findOne({email}).select("+password");
        // since we have given select false in passoword in schema
        // so bydefault when it will find that perticular user
        //it will return all the value except user's password
      
        if(!user){
            return res
            .status(400)
            .json({success:false, message: "Invalid password"});
        }

    const isMatch = await user.comparePassword(password);

    console.log(user);

    if (!isMatch) {
        return res
        .status(400)
        .json({ success:false, message: "Invalid Email or Password"});
    }

 
    sendToken(res,user,200,"Login successfull")
   

    } catch (error) {
        res
        .status(500)
        .json({success: false, message: error.message});
    }
};

export const logout = async (req,res)=>{
 
    try {
        res.status(200).cookie("token",null,{
            expires: new Date(Date.now()),
        })
        .json({ success: true, message: "Logged out successfully"});
    } catch (error) {
        res
        .status(500)
        .json({success: false, message: error.message});
    }
};

export const addTask = async (req,res)=>{
 
    try {
        
        const {title,description} = req.body;
        const user = await User.findById(req.user._id);
        user.tasks.push({
            title,
            description,
            completed:false,
            createdAt:new Date(Date.now())
        });

        await user.save();

        res
          .status(200)
          .json({success: true, message: "Task added successfully"})

    } catch (error) {
        res
        .status(500)
        .json({success: false, message: error.message});
    }
};

export const removeTask = async (req,res)=>{
 
    try {
        
        const {taskId} = req.params;
        const user = await User.findById(req.user._id);
        
        user.tasks = user.tasks.filter(task => task._id.toString() !== taskId.toString())



        await user.save();

        res
          .status(200)
          .json({success: true, message: "Task removed successfully"})

    } catch (error) {
        res
        .status(500)
        .json({success: false, message: error.message});
    }
};


export const updateTask = async (req,res)=>{
 
    try {
        
        const {taskId} = req.params;
        const user = await User.findById(req.user._id);
        
        const task = user.tasks.find((task) => task._id.toString() === taskId.toString())

        task.completed = !task.completed;

        await user.save();

        res
          .status(200)
          .json({success: true, message: "Task updated successfully"})

    } catch (error) {
        res
        .status(500)
        .json({success: false, message: error.message});
    }
};

export const getMyProfile = async (req,res)=>{
 
    try {

        const user = await User.findById(req.user._id)

        sendToken(res,user,201,`Welcome Back ${user.name}`);

    } catch (error) {
        res
        .status(500)
        .json({success: false, message: error.message});
    }
};

export const updateProfile = async (req,res)=>{
 
    try {
        const user = await User.findById(req.user._id);
        const {name} = req.body
        if(name) {
            user.name = name
        }

        
        const avatarTempFilePath = req.files.avatar.tempFilePath;
        
        if(avatarTempFilePath){
            await cloudinary.v2.uploader.destroy(user.avatar.public_id)

            const mycloud = await cloudinary.v2.uploader.upload(avatarTempFilePath,{
                folder: "todoApp",
            })


            fs.rmSync("./tmp", { recursive: true});

            user.avatar = {
                public_id: mycloud.public_id,
                url: mycloud.secure_url
            }
        }

        await user.save();
        res
        .status(200)
        .json({success: true, message: "Profile Updated Successfully"});
        
    } catch (error) {
        res
        .status(500)
        .json({success: false, message: error.message});
    }
};

export const updatePassword = async (req,res)=>{
 
    try {
        const user = await User.findById(req.user._id).select("+password");

        const {oldPassword, newPassword} = req.body;

        if(!oldPassword || !newPassword){

            return res
              .status(400)
              .json({success: false, message: "Please enter all fields"})

        }

        const isMatch = await user.comparePassword(oldPassword);

        if(!isMatch){
            return res
              .status(400)
              .json({success: true, message: "Invalid Old Password"})
        }

        user.password = newPassword;
        
        await user.save();
        
        res
        .status(200)
        .json({success: true, message: "Password Updated Successfully"});
        
    } catch (error) {
        res
        .status(500)
        .json({success: false, message: error.message});
    }
};

export const forgetPassword = async (req,res)=>{
 
    try {
        const {email} = req.body;
        const user = await User.findOne({email});

        if(!user)
        {
            return res
              .status(400)
              .json({success: false,message: "Invalid Email"})
        }

        

        const otp = Math.floor(Math.random()*100000);

        user.resetPasswordOtp = otp;

        user.resetPasswordOtpExpiry = Date.now() + 10 * 60 *1000;

        await user.save();

        const message = `Your OTP for reseting the password is ${otp}. If you did not request for this, please ignore
        this email`;

        await sendMail(email, "Request for Reseting Password", message);
 
        res
        .status(200)
        .json({success: true, message: `OTP sent to ${email}`});
        
    } catch (error) {
        res
        .status(500)
        .json({success: false, message: error.message});
    }
};

export const resetPassword = async (req,res)=>{
 
    try {
        const {otp,newPassword} = req.body;

        const user = await User.findOne({
            resetPasswordOtp: otp,
            resetPasswordOtpExpiry: {$gt: Date.now()}
        }).select("+password");

        if(!user)
        {
            return res
              .status(400)
              .json({success: false,message: "OTP Invalid or has been Expired"})
        }

        user.password = newPassword;

        user.resetPasswordOtp = null;
        user.resetPasswordOtpExpiry = null;

        await user.save();

        
        res
        .status(200)
        .json({success: true, message: "Password Change Successfully"});
        
    } catch (error) {
        res
        .status(500)
        .json({success: false, message: error.message});
    }
};