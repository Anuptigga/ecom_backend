import { Router } from "express";
import{ verifyToken, verifyTokenAdmin, verifyTokenAuthorization } from "./verifyToken.js";
import Cart from "../models/Cart.js";
const router=Router();


//CREATE 
router.post("/",verifyToken,async(req,res)=>{
    const newCart= new Cart(req.body);
    try{
        const savedCart= await newCart.save();
        res.status(200).json(savedCart);
    }catch(err){
        res.status(500).json(err);
    }
})


//UPDATE
router.put("/:id", verifyTokenAuthorization,async(req,res)=>{
    try {
        const updatedCart= await Cart.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new:true,}
        );
        
        res.status(200).json(updatedCart);
        
    } catch (error) {
        res.status(403).json(error);
    }
});

//DELETE
router.delete("/:id", verifyTokenAuthorization,async(req,res)=>{
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart deleted successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});


//GET  USER CART
router.get("/find/:userId",verifyTokenAuthorization ,async(req,res)=>{
    try {
        const cart = await Cart.findOne({userId : req.params.userId});
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL PRODUCTS

router.get("/",verifyTokenAdmin, async(req,res)=>{
    try {
        const cart=await Cart.find();
        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json(error);
    }
})


export default router;
