import Demo from "../models/Demo.js";

export const createStudent =async (req,res,next)=>{
    try {
        const {name,roll} = req.body;
        const respose = new  Demo({name,roll});
        const result = await respose.save();
        console.log(result);
        res.status(200).send(
           { status:200,
            respose,
            message:"Student created OKK"}
        )
        
    
    } catch (error) {
        console.log(error);
        
        
    }
}