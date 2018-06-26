var express = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/RESTful");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    //default: field defines the default placeholder 
    //value in case not defined by user
    created: { type: Date, default: Date.now }
});

app.get("/", function (req, res) {
    res.redirect("/blogs");
});
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("ERROR!!!");
        } else {
            res.render("index", { blogs: blogs })
        }
    });
});

//New Blog Creation Page
app.get("/blogs/new", function(req, res){
    res.render("new");    
});

//CREATE NEW
app.post("/blogs", function (req, res) {
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("==================================");
    console.log(req.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});


//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog})
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
})

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

//DESTROY ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }

    })
})

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://pixabay.com/get/ef3cb10a2ef21c22d2524518b7444795ea76e5d004b014439cf9c37ea6e9b2_340.jpg",
//     body: "HELLO THIS IS A POST!"
// })

//RESTFUL ROUTES
app.listen(3000, () => {
    console.log("Server has started");
});