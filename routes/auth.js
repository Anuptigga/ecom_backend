import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router=Router();


//REGISTER
router.post("/register",async(req,res)=>{
    const newUser= new User({
        username:req.body.username,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_RND)),
    });
    try{
        const savedUser=await newUser.save();
        res.status(201).json(savedUser);
    }
    catch(err){
        res.status(500).json(err);
    }
});


//LOGIN
router.post("/login",async(req,res)=>{
    try {
        const user=await User.findOne({username: req.body.username});
        if (!user) {
            return res.status(401).json("Wrong credentials");
          };
          const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
          if (!isPasswordCorrect) {
            return res.status(401).json("Wrong credentials");
          };

          const accessToken=jwt.sign(
            {
                id:user._id,
                isAdmin:user.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn:"1d"}
          );
          const {password,...others}=user._doc;
          return res.status(200).json({...others,accessToken});

    } catch (err) {
        res.status(500).json(err);
    }
})
export default router;