import mongoose from "mongoose";

const productSchema= new mongoose.Schema(
    {
        title:{type:String, required:true, unique:true},
        desc:{type:String, required:true,},
        img:{type:String, required:true},
        category:{type:Array},
        size:{type:String},
        color:{type:String, required:true},
        price:{type:Number, required:true},
    },
    {
        timestamps:true,
    }
)
export default mongoose.model("Product",productSchema);