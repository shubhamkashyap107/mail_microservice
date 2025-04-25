const express = require("express")
const app = express()
const cors = require("cors")
const {mailRouter} = require("./Routers/mailRouter")
require("dotenv").config()


app.use(express.json())
app.use(cors())
app.use("/mail", mailRouter)






app.listen(8081, () => {
    console.log("Server Listening on Port 8081")   
})