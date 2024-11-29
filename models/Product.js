import mongoose from "mongoose";

const productSchema= new mongoose.Schema(
    {
        title:{type:String, required:true, unique:true},
        desc:{type:String, required:true,},
        img:{type:String, required:true},
        category:{type:Array},
        size:{type:Array},
        color:{type:Array, required:true},
        price:{type:Number, required:true},
        inStock:{type:Boolean, default:true},
    },
    {
        timestamps:true,
    }
)
export default mongoose.model("Product",productSchema);