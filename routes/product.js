import { Router } from "express";
import{ verifyTokenAdmin, verifyTokenAuthorization } from "./verifyToken.js";
// import bcrypt from "bcrypt";
import Product from "../models/Product.js";
import { now } from "mongoose";
const router=Router();now


//CREATE 
router.post("/",verifyTokenAdmin,async(req,res)=>{
    const newProduct= new Product(req.body);
    try{
        const savedProduct= await newProduct.save();
        res.status(200).json(savedProduct);
    }catch(err){
        res.status(500).json(err);
    }
})


//UPDATE
router.put("/:id", verifyTokenAdmin,async(req,res)=>{
    try {
        const updatedProduct= await Product.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new:true,}
        );
        
        res.status(200).json(updatedProduct);
        
    } catch (error) {
        res.status(403).json(error);
    }
});

//DELETE
router.delete("/:id", verifyTokenAdmin,async(req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product deleted successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});


//GET PRODUCT
router.get("/find/:id",async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL PRODUCTS
router.get("/", async(req,res)=>{
    const qNew=req.query.new; 
    const qCagtegory=req.query.category;
    try {
      let products;
      if(qNew){
        products=await Product.find().sort({createdAt:-1}).limit(5);
      }else if(qCagtegory){
        products=await Product.find({
            category:{
                $in:[qCagtegory],
            },
        });
      }else{
        products=await Product.find();
      }
        res.status(200).json(products); 
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;
