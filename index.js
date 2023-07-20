const express = require('express');
const app = express();
const bodyParser=require('body-parser')
require('dotenv').config()
app.use(bodyParser.urlencoded({extended:true}))
const mongoose = require('mongoose')
app.set('view engine','ejs')

let URI = process.env.URI
let PORT = process.env.PORT_NUMBER || 4500
mongoose.connect(URI)
.then(()=>{
    console.log("Mongoose has connected successfully");
})
.catch((err)=>{
    console.log(err);
})

let userSchema = {
    firstname: {type: String, required: true},
    lastname: {type:String, required: true},
    email: {type: String, required: true, unique:true},
    password: {type:String, required: true}
}


let userModel = mongoose.model("users", userSchema)


let cart=[{
    id: 1,
    item: "Pen",
    Price: 200
},
        {
            id: 2,
            item: "Book",
            Price: 500
        },
        {
            id: 3,
            item: "Chalk",
            Price: 600
        }
]
let studentArray =[{
    
    
                id: 1,
                name: "Ajala",
                complexion: "milo"
            },
            {
                id: 1,
                name: "Ajala",
                complexion: "milo"
            },
            {
                id: 1,
                name: "Ajala",
                complexion: "milo"
            },
            {
                id: 1,
                name: "Ajala",
                complexion: "milo"
            }
]

app.get('/',(req,res)=>{
    // res.send(studentArray)
    res.render('index', {studentArray})

})
app.get('/home',(req,res)=>{
    res.render('home',{cart})

})
app.get('/signup',(req,res)=>{
    res.render("signup",{message:""})
  

})
app.post('/details',(req,res)=>{
    // console.log("I have submitted");
    // res.send('successful')
    // res.send(req.body)
    
    
    let form =new userModel(req.body)
    
    form.save()
    .then((result)=>{
        console.log("form submitted successfully");
        console.log(result);
        res.send({message:"form submitted successfully", status:true})
        res.redirect("signin")
    })
    .catch((err)=>{
        console.log(err);
        if (err.code == 11000) {
            res.render("signup", {status:false, message:"Duplicate user found"})
        }else{
            res.render("signup", {status:false, message:"Please fill in appropriately "})
        }
        
    })
   

})
app.get("/dashboard",(req,res)=>{
    userModel.find()
    .then((result)=>{
         console.log(result);
         res.render("dashboard", {userDetails:result})

    })
    .catch((err)=>{
        console.log(err);
        
    })
})
app.get("/signin",(req,res)=>{
   res.render("signin",{message:""})
   
})


app.post("/signin",(req,res)=>{
    userModel.findOne({email:req.body.email, password:req.body.password})
    
   
    .then((result)=>{
        // console.log("form2 submitted successfully");
        console.log(result);
        if (result) {
            res.redirect("dashboard")
        } else {
            res.render("signin",{message:"User not found"})
        }
        
    })
    .catch((err)=>{
        console.log(err);
        
        
    })
})
app.post("/delete",(req,res)=>{
    console.log(req.body);

    userModel.findOneAndDelete({email:req.body.userEmail})
    .then((result)=>{
        console.log(result, "user deleted sussessfully");

        res.redirect("/dashboard")

    })
    .catch((err)=>{
        console.log(err);
    })
})
app.post("/edit",(req,res)=>{
    userModel.findOne({email:req.body.userEmail})
    .then((result)=>{
        if (result) {
            res.render("editusers", {info:result})
            console.log(result);
            
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})
app.post("/update",(req,res)=>{
    console.log(req.body);
    let mail = req.body.email
    userModel.findOneAndUpdate({email: mail},req.body)
    .then((result)=>{
        if (result) {
            console.log(result);
            res.redirect("/dashboard")  
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})
app.listen(PORT,()=>{
    console.log(`Server has started on port ${PORT}`);

})