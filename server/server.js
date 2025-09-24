import express from "express";
import 'dotenv/config' //  to load the data to `process` variable
import { Connect } from "./config/connection.js";
import demoRoutes from "./routes/demoRoutes.js"

const app = express();


app.use(express.json())// parser to use json
const PORT = process.env.PORT || 4000
app.get("/", (req, res) => {
    
    res.send("Hello world")

})

app.use('/api/demo',demoRoutes)
// default path
app.use('/',(req,res)=>{
    res.send("<H1> NAMASTE </H1>")
})


app.listen(PORT, () => {
    Connect()
    console.log("Connected to server");

})