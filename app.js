const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const _ =require("lodash");
// const replaceStr = require("./public/javascript/javascript.js");
const mongoose=require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const req = require("express/lib/request");
const res = require("express/lib/response");
const razorpay=require("razorpay");
var instance = new razorpay({
    key_id: 'rzp_test_Q0aUfFVrFy24bS',
    key_secret: 'nhT8Kmrx67tNSogRm9btHVAx',
  });

const app=express();
let as=[];
let b=[];
let c=[];
let f=[];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
    secret: "ourlittlesecret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/TarunEnclaveDB");

const comSchema={
    cFname:String,
    cLname:String,
    cType:[String],
    cHouseNumber:Number,
    cFloorNumber:String,
    cDate:Date,
    cDescription:String
};

const Complaint=mongoose.model("Complaint",comSchema);

const buySchema={
    bFname:String,
    bLname:String,
    bHouseNumber:Number,
    bFloorNumber:String,
    bPhoneNumber:Number,
    bDate:Date,
    bDescription:String
};

const Buy=mongoose.model("Buy",buySchema);

const userSchema=new mongoose.Schema({
    fname:String,
    lname:String,
    gender:String,
    housenumber:Number,
    Floor_number:String,
    email:String,
    password:String,
    role:String,
    complaint:comSchema,
    due:Number
    
});

userSchema.plugin(passportLocalMongoose);

const User= new mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const annSchema={
    abody:  String
};

const Announcement=mongoose.model("Announcement", annSchema);

const notSchema={
    ntitle: String,
    nbody: String
};

const Notice=mongoose.model("Notice", notSchema);

const visiSchema={
    vresifname:String,
    vresilname:String,
    visiname:String,
    visihousenumber:Number,
    visifloornumber:String,
    visidate:Date,
    visitime:String,
    visidescription:String
};

const Visitor=mongoose.model("Visitor",visiSchema);



app.get("/", function(req,res){
    

    if(req.isAuthenticated()){
    
    
    Notice.find({},function(err,founditems){
    
    as=founditems;
    
    });
    Announcement.find({},function(err,foundannouncements){
        b=foundannouncements;
        });
    res.render("index.ejs",{posts:as,anns:b});
    }else{
        res.redirect("/signin");
    }

});

app.get("/signin", function(req,res){
    res.render("signin.ejs")
});
app.get("/signup", function(req,res){
    res.render("signup.ejs")
});

app.post("/signin", function(req, res){
    const user=new User({
        username:req.body.username,
        password:req.body.password
    });
    req.login(user, function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/");
            });
        }
    });
});

app.post("/signup",function(req,res){

    User.register({fname:req.body.fname,lname:req.body.lname,housenumber:req.body.housenumber,Floor_number:req.body.Floor_number,username:req.body.username,role:"user"}, req.body.password, function(err,user){
        if(err){
            console.log(err);
            res.redirect("/signup");
        
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/signin");
            });
        }
    });
});

app.get("/notauth",function(req,res){
    res.render("notauth.ejs");
})

app.get("/complaint", function(req,res){
    if(req.isAuthenticated()){
    res.render("complaint.ejs")
    }else{
        res.redirect("/signin");
    }
});
app.get("/visitor", function(req,res){
    if(req.isAuthenticated()){
    res.render("visitor.ejs")
    }
    else{
        res.redirect("signin");
    }
});

app.post("/complaint",function(req,res){
    
    const firstname=req.body.fname;
    const lastname=req.body.lname;
    const ctype=req.body.Complaint; 
    const housenumber=req.body.hnumber;
    const floornumber=req.body.Floor_number;
    const date=req.body.cdate;
    const description=req.body.cdesc;
    const com=new Complaint({cFname:firstname,
                cLname:lastname,
                cType:ctype,
                cHouseNumber:housenumber,
                cFloorNumber:floornumber,
                cDate:date,
                cDescription:description});
         com.save();
         User.findByIdAndUpdate(req.user.id,{complaint:com},function(err,fuser){
             if(err){
                 console.log(err);
             }
         });
       
        
        res.redirect("/");
        
});

app.get("/mycomplaints", function(req,res){
    if(req.isAuthenticated()){
        User.findById(req.user.id,function(err,coms){
            if(err){
                console.log(err);
            }else{
                // res.render("mycomplaints.ejs",{complaints:coms.complaint})
                f=[coms.complaint];
                res.render("mycomplaints.ejs",{posts:f});
                // console.log(f);
                
            }
        })
    }
})

app.get("/viewcomplaint", function(req,res){
    if(req.isAuthenticated()){
        if(req.user.role==="admin"){
            Complaint.find({},function(err,fitems){
            res.render("viewcomplaint.ejs",{arrs:fitems})
            // console.log(fitems);
            
            });
        }
        else{
            res.redirect("/notauth");
        }
}}
        );
    
app.post("/visitor",function(req,res){
    const vfname=req.body.visifname;
    const vlname=req.body.visilname;
    const vname=req.body.visiname;
    const vhousenumber=req.body.visihn;
    const vfloornumber=req.body.visiFloor_number;
    const vdate=req.body.visid;
    const vtime=req.body.visit;
    const vdes=req.body.viside;
    const vis=new Visitor({
        vresifname:vfname,
        vresilname:vlname,
        visiname:vname,
        visihousenumber:vhousenumber,
        visifloornumber:vfloornumber,
        visidate:vdate,
        visitime:vtime,
        visidescription:vdes
    });
    vis.save();
    res.redirect("/");
});

app.get("/viewvisitor", function(req,res){
    if(req.isAuthenticated()){
        if(req.user.role==="admin"){
        Visitor.find({},function(err,vitems){
            res.render("viewvisitor.ejs",{vrs:vitems});
        });
    }
    else{
        res.redirect("/notauth");
    }
}});

app.get("/viewvisitor/:resiflname",function(req,res){
    if(req.isAuthenticated()){
    Visitor.find({vresifname:req.params.resiflname}, function(err,vitems){
        if(vitems){
            
            c=vitems;
            res.send(c);
            
            
        }else{
            res.send("no match found");
        }
        
        
    });
}else{
    res.redirect("/signin");
}
});

app.get("/chatbot",function(req,res){
    res.render("chatbot.ejs");
})

app.get("/notice",function(req,res){

    if(req.isAuthenticated()){
        if(req.user.role==="admin"){
        res.render("notice.ejs");
        ;
    }
    else{
        res.redirect("/notauth");
    }
}
   
});
app.post("/notice", function(req,res){
    const publishcontent=req.body.pcontent;
    const publishpost=req.body.text1;
    const not= new Notice({
        ntitle:publishcontent,
        nbody:publishpost
    });
    not.save();
    res.redirect("/");
    });

    app.get("/posts/:postName",function(req, res){
      if(req.isAuthenticated())
      {if(req.user.role==="admin"){
                const requestedtitle = _.lowerCase(req.params.postName) ;
                as.forEach(function(a){
                let storedTitle=_.lowerCase(a.ntitle);
                if(requestedtitle===storedTitle){
                res.render("postadmin.ejs",{postTitle1:a.ntitle,postbody1:a.nbody});
                }});
    }else{
        const requestedtitle = _.lowerCase(req.params.postName) ;
         as.forEach(function(a){
        let storedTitle=_.lowerCase(a.ntitle);
            if(requestedtitle===storedTitle){
                res.render("post.ejs",{postTitle1:a.ntitle,postbody1:a.nbody});
                    }
                    });
                    
                }}else{
                    res.redirect("/signin");
                    }
});
app.get("/announcement",function(req,res){
    if(req.isAuthenticated()){
        if(req.user.role==="admin"){
        res.render("announcement.ejs");
        ;
    }
    else{
        res.redirect("/notauth");
    }
}
});
app.post("/announcement", function(req,res){
    const anncontent=req.body.acontent;
    const ann= new Announcement({
        abody:anncontent
    });
    ann.save()
    res.redirect("/");
    });

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect("/");
    });
  });

app.post("/delete",function(req,res){
    
    Notice.deleteOne(
        {ntitle:req.body.deletereq},
        function(err){
            if (!err){
                res.redirect("/");
            }else{
                res.send(err);
            }
        })
})

app.get("/buysell",function(req,res){
    if(req.isAuthenticated()){
    res.render("buysell.ejs");
    }
});

app.post("/buysell",function(req,res){
    const firstname=req.body.fname;
    const lastname=req.body.lname; 
    const housenumber=req.body.hnumber;
    const floornumber=req.body.Floor_number;
    const phonenumber=req.body.pnumber
    const date=req.body.cdate;
    const description=req.body.cdesc;
    const buy=new Buy({bFname:firstname,
                bLname:lastname,
                bHouseNumber:housenumber,
                bFloorNumber:floornumber,
                bPhoneNumber:phonenumber,
                bDate:date,
                bDescription:description});
         buy.save();
         res.redirect("/");

});
app.get("/viewlisting", function(req,res){
    if(req.isAuthenticated()){
        
            Buy.find({},function(err,fitems){
            res.render("viewlisting.ejs",{arrs:fitems})
            // console.log(fitems);
            
            });
        
        
            
        }else{
        res.redirect("/notauth");
        }
    });


app.get("/users", function(req,res){
    if(req.isAuthenticated()){
        if(req.user.role==="admin"){
            User.find({},function(err,rusers){
                res.render("users.ejs",{arrs:rusers})
            });
    }
    else{
        res.redirect("/notauth");
    }
}

})


app.get("/updateusers/:id",function(req,res){
    User.findById(req.params.id,function(err,fuser){
        if(err){
            console.log(err);
        }else{
        res.render("updateusers.ejs",{user:fuser});
        }
    })
    
});

app.post("/updateusers",function(req,res){
    const amt=req.body.amount;
    User.findByIdAndUpdate(req.body.uid,{due:amt},function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/users");
        }
    })
})

app.get("/dues", function(req,res){
    if(req.isAuthenticated()){
        User.findById(req.user.id,function(err,due){
            if(err){
                console.log(err);
            }else{
                // res.render("mycomplaints.ejs",{complaints:coms.complaint})
                at=[due]
                res.render("dues.ejs",{posts:at});
                // console.log(f);
                
            }
        })
    }
})




// app.post("/create/orderId",function(req,res){
//     console.log("create orderID request",req.body);
//     var options={
//         amount:req.user.due,
//         currency:"INR",
//         receipt:"rcp1"
//     };
//     instance.orders.create(options, function(err, order){
//         console.log(order);
//         res.send({orderId: order.id});
//     });
// })


app.listen(3000, function(req,res){
    console.log("server is running on port 3000");
});