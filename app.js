const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const _ =require("lodash");
const replaceStr = require("./public/javascript/javascript.js");
const mongoose=require("mongoose");


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
mongoose.connect("mongodb://localhost:27017/TarunEnclaveDB");


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
    
    Notice.find({},function(err,founditems){
    
    as=founditems;
    
    // res.render("index.ejs",{posts:founditems});
    
    
    });
    Announcement.find({},function(err,foundannouncements){
        b=foundannouncements;
        });
    
    

    res.render("index.ejs",{posts:as,anns:b});

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
app.get("/complaint", function(req,res){
    res.render("complaint.ejs")
});
app.get("/visitor", function(req,res){
    res.render("visitor.ejs")
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
        res.redirect("/viewcomplaint");
        
});
app.get("/viewcomplaint", function(req,res){
    Complaint.find({},function(err,fitems){
        res.render("viewcomplaint.ejs",{arrs:fitems})
    });
});


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
    res.redirect("/viewvisitor");
    // Visitor.find({},function(err,vitems){
    //     res.render("viewvisitor.ejs",{vrs:vitems})
    // });
    // vrs.push(arr2);
    // res.render("viewvisitor.ejs",{vrs:vrs})
});

app.get("/viewvisitor", function(req,res){
    Visitor.find({},function(err,vitems){
        res.render("viewvisitor.ejs",{vrs:vitems})
    });
});


app.get("/notice",function(req,res){
    res.render("notice.ejs");
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
    const requestedtitle = _.lowerCase(req.params.postName) ;
    as.forEach(function(a){
      let storedTitle=_.lowerCase(a.ntitle);
      if(requestedtitle===storedTitle){
        res.render("post.ejs",{postTitle1:a.ntitle,postbody1:a.nbody});
      }
    });
});


app.get("/announcement",function(req,res){
    res.render("announcement.ejs");
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

app.listen(3000, function(req,res){
    console.log("server is running on port 3000");
});