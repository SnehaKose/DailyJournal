//jshint esversion:6
require('dotenv').config();
const PORT =process.env.PORT||3000;
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require ("mongoose");

const app = express();

const homeStartingContent = "Hey Love ,Writing is way of expressing – and thereby eliminating – all the various ways we can be wrong-headed. Do not stress out too much just WRITE what your are thinking...";
const aboutContent = " Hey there!, I'm Sneha Kose. We made this web app with so much Love and passion.You can use this web as a medium of expressing your thoughts and ideas. ";
const contactContent = " Email id: snehakose@63gmail.com | 0808CS211171.ies@ipsacademy.org";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//let posts=[];
//dbms
mongoose.connect("mongodb+srv://snehakose63:khanak@blogcluster.8f77i5y.mongodb.net/blogDB", {useNewUrlParser: true});
const postSchema ={
  title:String,
  content:String
}
const Post =mongoose.model("Post",postSchema);


app.get("/",function(req,res){
  //res.render("home");
  //res.render("page_name"{js object---key(Marker ejs):value})
  //res.render("home", {Para1:homeStartingContent , posts:posts });
  
  Post.find().then(function (posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});


app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){

  //saving the composed post
  const post=new Post({
    title:req.body.newTitle,
    content :req.body.mainText
  });
  post.save().then(() => {
    console.log("Post saved successfully");
    res.redirect("/");
  })
  .catch((err) => {
    console.log("Error");
  });
  
  
});

app.get("/posts/:topic",function(req,res){
  
  const requestedTitle =req.params.topic;
  //console.log(requestedTitle);
  Post.findOne({ _id:requestedTitle }).then((post) => {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
 
 /* posts.forEach(function(post){
    
    const storedTitle =_.lowerCase(post.title);
    
    if(requestedTitle===storedTitle){
      
    }

  });*/
});


app.get("/requestedTitle",function(req,res){
  res.render("post");
});

app.get("/about",function(req,res){
  res.render("about",{Para2:aboutContent});
});
app.get("/contact",function(req,res){
  res.render("contact",{Para3:contactContent});
});

//<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

app.post("/delete",function(req,res){
  const deletePostId = req.body.deletePost;
  console.log(deletePostId);
  Post.findByIdAndRemove(deletePostId)
            .then(function () {
                console.log("Successfully removed");
            })
        .catch(function (err) {
                console.log(err);
            });
            res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
