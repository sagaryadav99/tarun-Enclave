const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const _ =require("lodash");
const replaceStr = require("./public/javascript/javascript.js");
const mongoose=require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");


const app=express();

const arrs=[];
const vrs=[];
// const posts=[];
// const anns=[];
// const founditems=[];
// const foundnotice=[];
let as=[];
let b=[];
let c=[];


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

const userSchema=new mongoose.Schema({
    fname:String,
    lname:String,
    gender:String,
    housenumber:Number,
    Floor_number:String,
    email:String,
    password:String,
    role:String
    
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

const comSchema={
    cFname:String,
    cLname:String,
    cType:String,
    cHouseNumber:Number,
    cFloorNumber:String,
    cDate:Date,
    cDescription:String
};

const Complaint=mongoose.model("Complaint",comSchema);


app.get("/", function(req,res){

    if(req.isAuthenticated()){
    
    
    Notice.find({},function(err,founditems){
    
    as=founditems;
    
    
    // res.render("index.ejs",{posts:founditems});
    
    
    });
    Announcement.find({},function(err,foundannouncements){
        b=foundannouncements;
        });
    
    

    res.render("index.ejs",{posts:as,anns:b});
    }else{
        res.redirect("/signin");
    }

    // Notice.find({},function(err,founditems){
    //     res.render("index.ejs",{posts:founditems});
    // });

    // Notice.find({},function(err,foundnotices){
    //     res.send({posts:foundnotices});
    // });
    // res.render("index.ejs");

    //  res.render( "index.ejs",{posts:posts,anns:anns});
});

app.get("/signin", function(req,res){
    res.render("signin.ejs")
});
app.get("/signup", function(req,res){
    res.render("signup.ejs")
});

// app.get("/adminsignup", function(req,res){
//     res.render("adminsignup.ejs");
// });

// app.get("/adminlogin", function(req,res){
//     res.render("adminlogin.ejs");
// });



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


    // var registerUser=new User({fname:req.body.fname,lname:req.body.lname,gender:req.body.housenumber,Floor_number:req.body.Floor_number,username:req.body.username});
    // registerUser.register(registerUser,req.body.password, function(err, user){
    //     if(!err){
    //         passport.authenticate("local")(req,res, function(){
    //             res.redirect("/signin");
    //         });
    //     }
    // });
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
    const ctype=JSON.stringify(replaceStr); 
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
        // arrs.push(arr1);
        // Complaint.find({},function(err,fitems){
        // res.render("viewcomplaint.ejs",{arrs:fitems});
        // });
        res.redirect("/");
        
});
app.get("/viewcomplaint", function(req,res){
    if(req.isAuthenticated()){
        if(req.user.role==="admin"){
            Complaint.find({},function(err,fitems){
            res.render("viewcomplaint.ejs",{arrs:fitems})
            });
        }
        else{
            res.redirect("/notauth");
        }
}}
        );
    // Complaint.find({},function(err,fitems){
    //     res.render("viewcomplaint.ejs",{arrs:fitems})



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
    // Visitor.find({},function(err,vitems){
    //     res.render("viewvisitor.ejs",{vrs:vitems})
    // });
    // vrs.push(arr2);
    // res.render("viewvisitor.ejs",{vrs:vrs})
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
}
    
});

app.get("/viewvisitor/:resiflname",function(req,res){
    if(req.isAuthenticated()){
    Visitor.find({vresifname:req.params.resiflname}, function(err,vitems){
        if(vitems){
            // res.render("viewvisitor.ejs",{vrs:vitems});
            c=vitems;
            res.send(c);
            
            
        }else{
            res.send("no match found");
        }
        // res.render("viewvisitor.ejs",{vrs:c});
        
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
    // if(req.isAuthenticated()){
    // res.render("notice.ejs");
    // }else{{
    //     res.redirect("/signin");
    // }}
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
    
    
    // const post={title:publishcontent,
    //           body:publishpost};
    // posts.push(post);
    // res.redirect("/");
  
  
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
    // if(req.isAuthenticated()){
    // res.render("announcement.ejs");
    // }else{
    //     res.redirect("/signin");
    // }
});


app.post("/announcement", function(req,res){
    const anncontent=req.body.acontent;
    const ann= new Announcement({
        abody:anncontent
    });
    ann.save()
    res.redirect("/");
    
    // const ann={title:anncontent}
    // anns.push(ann);
    // res.redirect("/");
   });
// app.get("/logout",function(req,res){
//     req.logout();
//     res.redirect("/");
// });

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

// app.get("/noticeupdate",function(req,res){
//     res.render("noticeupdate.ejs");

// })

// app.post("/noticeupdate",function(req,res){
//     app.post("/notice", function(req,res){
//         const publishcontent=req.body.pcontent;
//         const publishpost=req.body.text1;
//         const not= new Notice({
//             ntitle:publishcontent,
//             nbody:publishpost
//         });
//         not.save();
//         res.redirect("/");
        
        
//         // const post={title:publishcontent,
//         //           body:publishpost};
//         // posts.push(post);
//         // res.redirect("/");
      
      
//       });
// })

app.listen(3000, function(req,res){
    console.log("server is running on port 3000");
});