import mongoose from "mongoose";

const DemoSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    roll:{
        type:Number,
        required:true,
        
    }
})
export default mongoose.model("Demo",DemoSchema);