const connectDB = require("./config/db")
const app = require("./app")
const dotenv = require("dotenv")

dotenv.config()
connectDB()

PORT = process.env.PORT ||5000
app.listen(PORT, (error)=>{
    console.log("Server Running Port " +   PORT)
})
