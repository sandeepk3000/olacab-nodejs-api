import { app } from "./app.js";
import dotenv from "dotenv";
import connectToDB from "./db/db.js";
const port = process.env.PORT || 3000;
dotenv.config()
connectToDB()
.then(()=>{
    app.listen(port,()=>{
        console.log("server is listne at port ", port)
    })
})
.catch((error)=>{
    console.log("server is crashed".error)
})