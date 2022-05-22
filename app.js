const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const _ =require("lodash");
const replaceStr = require("./public/javascript/javascript.js");


const app=express();

const arrs=[];
const vrs=[];
const posts=[];
const anns=[];


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




app.get("/", function(req,res){
    res.render( "index.ejs",{posts:posts,anns:anns});
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
    
    let firstname=req.body.fname;
    let lastname=req.body.lname;
    let ctype=JSON.stringify(replaceStr); 
    let housenumber=req.body.hnumber;
    let floornumber=req.body.Floor_number;
    let date=req.body.cdate;
    let description=req.body.cdesc;
    const arr1={firname:firstname,
                lasname:lastname,
                comtype:ctype,
                hounumber:housenumber,
                floonumber:floornumber,
                da:date,
                desc:description}
        arrs.push(arr1);
        res.render("viewcomplaint.ejs",{arrs:arrs});
});


app.post("/visitor",function(req,res){
    let vfname=req.body.visifname;
    let vlname=req.body.visilname;
    let vname=req.body.visiname;
    let vhousenumber=req.body.visihn;
    let vfloornumber=req.body.visiFloor_number;
    let vdate=req.body.visid;
    let vtime=req.body.visit;
    let vdes=req.body.viside;
    const arr2={
        vfn:vfname,
        vln:vlname,
        vvn:vname,
        vhn:vhousenumber,
        vfln:vfloornumber,
        vd:vdate,
        vt:vtime,
        vde:vdes
    }
    vrs.push(arr2);
    res.render("viewvisitor.ejs",{vrs:vrs})
});

app.get("/notice",function(req,res){
    res.render("notice.ejs");
});

app.post("/notice", function(req,res){
    let publishcontent=req.body.pcontent;
    let publishpost=req.body.text1;
    const post={title:publishcontent,
              body:publishpost}
    posts.push(post);
    res.redirect("/");
  
  
  });


  app.get("/posts/:postName",function(req, res){
    const requestedtitle = _.lowerCase(req.params.postName) ;
    posts.forEach(function(post){
      let storedTitle=_.lowerCase(post.title);
      if(requestedtitle===storedTitle){
        res.render("post.ejs",{postTitle1:post.title,postbody1:post.body});
      }
    });
});


app.get("/announcement",function(req,res){
    res.render("announcement.ejs");
});


app.post("/announcement", function(req,res){
    let anncontent=req.body.acontent;
    
    const ann={title:anncontent}
    anns.push(ann);
    res.redirect("/");
   });

app.listen(3000, function(req,res){
    console.log("server is running on port 3000");
});