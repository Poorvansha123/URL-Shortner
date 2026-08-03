const express=require("express");
const {connectToMongoDB}=require("./connect")
const path=require("path")
const URL=require("./models/url")
const urlRoute=require("./routes/url")
const staticRoute=require("./routes/staticRouter")

const app=express();
const PORT=8001;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url').then(()=>console.log("MongoDB connected"))

app.set("view engine","ejs")//teeling what engines
app.set("views",path.resolve("./views"))// teeling the path of my ejs files

app.use(express.json())//middleware 
app.use(express.urlencoded({extended:false}))

app.use("url",urlRoute)
app.use("/",staticRoute)
app.get('/:shortId',async(req,res)=>{
    const shortId=req.params.shortId;
const entry=await URL.findOneAndUpdate(
    { shortId,},{
        $push:{
            visitHistory:{
                timestamp:Date.now(),
            }
        },
    }
)
res.redirect(entry.redirectURL)
})


app.listen(PORT,()=>console.log(`Server started at PORT:${PORT}`))