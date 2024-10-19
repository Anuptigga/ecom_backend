import { Router } from "express";
import{ verifyTokenAdmin, verifyTokenAuthorization } from "./verifyToken.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";
const router=Router();

//UPDATE
router.put("/:id", verifyTokenAuthorization,async(req,res)=>{
    if(req.body.password){
        req.body.password=bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_RND));
    }
    try {
        const updatedUser= await User.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new:true,}
        );
        
        res.status(200).json(updatedUser);
        
    } catch (error) {
        res.status(403).json(error);
    }
});

//DELETE
router.delete("/:id", verifyTokenAuthorization,async(req,res)=>{
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});


//GET USER
router.get("/find/:id", verifyTokenAdmin,async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const {password, ...others}=user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
});
//GET ALL USERS
router.get("/", verifyTokenAdmin,async(req,res)=>{
    const query=req.query.new;
    try {
        const user = query? await User.find().sort({_id:-1}).limit(5): await User.find();
        res.status(200).json(user); 
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET STATS
router.get("/stats", verifyTokenAdmin, async(req,res)=>{
    const date=new Date();
    const lastYear= new Date(date.setFullYear(date.getFullYear()-1));
    try {
        const data=await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: lastYear },  // Filter documents from the last year
                },
            },
            {
                $project: {
                    month: { $month: "$createdAt" },  // Extract the month from 'createdAt' date field
                },
            },
            {
                $group: {
                    _id: "$month",  // Group by the 'month' field projected in the previous stage
                    total: { $sum: 1 },  // Count the number of documents for each month
                },
            },
            {
                $sort: { _id: 1 },  // Optional: Sort by month (1 for ascending)
            },

        ])
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
})

export default router;
