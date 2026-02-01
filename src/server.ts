import app from "./app";
import { config } from "./config/config";
import { connectDB } from "./config/db";



app.listen(config.port,async()=>{
    console.log(`Server is running http://localhost:${config.port}`);
    await connectDB();
    
})