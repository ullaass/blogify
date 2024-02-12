const path = require('path')
const express = require("express");
const mongoose = require('mongoose')

const cookiePaser = require("cookie-parser");
const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express()
const PORT = 8000

mongoose.connect('mongodb://localhost:27017/blogify').then((e)=>console.log('mongodb connected'))
app.set('view engine','ejs');
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")));
app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  });
  

app.use('/user',userRoute)
app.use('/blog',blogRoute)

app.listen(PORT, ()=> console.log(`Server started at PORT: ${PORT}`))