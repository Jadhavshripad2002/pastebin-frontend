require("dotenv").config();
const app=require("./app");
const{ checkDConnection } =require("./config/db");

const PORT=process.env.PORT ||3000;

async function startServer(){
    try{
        await checkDConnection();
        console.log("Database is connected");


        app.listen(PORT, ()=>{
            console.log(`serevre running on port ${PORT}`);
        });
    }catch(error){
        console.error("failed to start:",error.message);
        process.exit(1);
    }
}
startServer();