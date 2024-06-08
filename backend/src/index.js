import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path: "./.env"
});

// console.log(process.env.MONGODB_URI);
connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("ERROR: ", error);
        throw error;
    });
    
    app.listen(process.env.PORT || 8000, () => {
        console.log(` Server is running at port : ${process.env.PORT}`);
    }) 
})
.catch((error) => {
    console.log("MONGO DB Connection Failed !!! ", error);
});



