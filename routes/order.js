import { Router } from "express";
import{ verifyToken, verifyTokenAdmin, verifyTokenAuthorization } from "./verifyToken.js";
import Order from "../models/Order.js";
const router=Router();


//CREATE 
router.post("/",verifyToken,async(req,res)=>{
    const newOrder= new Order(req.body);
    try{
        const savedOrder= await newOrder.save();
        res.status(200).json(savedOrder);
    }catch(err){
        res.status(500).json(err);
    }
})


//UPDATE
router.put("/:id", verifyTokenAdmin,async(req,res)=>{
    try {
        const updateOrder= await Order.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new:true,}
        );
        
        res.status(200).json(updatedOrder);
        
    } catch (error) {
        res.status(403).json(error);
    }
});

//DELETE
router.delete("/:id", verifyTokenAdmin,async(req,res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order deleted successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});


//GET  USER ORDER
router.get("/find/:userId",verifyTokenAdmin ,async(req,res)=>{
    try {
        const orders = await Order.find({userId : req.params.userId});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL PRODUCTS

router.get("/",verifyTokenAdmin, async(req,res)=>{
    try {
        const orders=await Order.find();
        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json(error);
    }
})

//GET MONTHLY INCOME
router.get("/income",verifyTokenAdmin,async(req,res)=>{
    const date= new Date();
    const lastMonth= new Date(date.setMonth(date.getMonth()-1));
    const previousMonth= new Date(new Date().setMonth(lastMonth.getMonth()-1));

    try {
        const income=await Order.aggregate([
            {$match:{createdAt:{$gte:previousMonth}}},
            {
                $project:{
                    month:{$month:"$createdAt"},
                    sales:"$amount",

                },
            },
            {
                $group:{
                   _id:"$month",
                   total:{$sum:"$sales"}
                }
            }


        ])

        res.status(200).json(income);
    } catch (error) {
        res.status(500).json(error);
    }

});


export default router;
