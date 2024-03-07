const express = require('express')
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require("cors")


const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    app.listen(port, () => {
        console.log(`im listining at:${port}`)
    })})
.catch((error) => {
    console.log(error.message)
})

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }, 
    password:{
        type: String,
        required: true
    }

})

const userDetails = mongoose.model("userData", userSchema)


app.get('/', async (req, res) => {
    try{
        const data = await userDetails.find()
        
        res.status(200).json(data)
    }catch(err){
        console.log(err.message)
    }
    
})


app.post("/signup", async (req, res) => {
    const {email, password} = req.body
    const details = {
        email: email, 
        password: password
    }
    console.log(password)
    const check = await userDetails.findOne({email: email})
    
    if(!email){
        res.status(200).json("Name is required");
    }
    else if(!password){
        res.status(200).json("password required")
    }else if(check){
        res.status(200).json("User Already Exists")
    }
    else{
        try {
            const data = await userDetails.insertMany(details)
            console.log("User data created:", data);
            res.status(200).json("user succusse fully sigend")
         } catch (error) {
             console.log(error.message)
             res.status(500).send(error.message)
         } 
    }
    
})

app.post("/login", async (req, res) => {
    const {email, password} = req.body
    
    try{
        const check = await userDetails.findOne({email: email}) 
        const passwordMatch = password === check.password
        if(check && passwordMatch){
            console.log("user exists")
            res.status(200).send("user here")
        }
        else{
            console.log("password not match or user not exists")
            res.status(400).send("not")
        }
    
    }catch(err) {
        console.log(err.message)
        res.status(400).send(err.message)
    }
})


