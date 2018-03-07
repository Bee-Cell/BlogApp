//import the express and mongoose
var bodyParser 			= 	require("body-parser"),
	methodOverride 		= require("method-override"),
	expressSanitizer 	= require("express-sanitizer"),
	mongoose 			= 	require("mongoose"),
	express 			= 	require("express");

var app = express();
//app config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//schema
//Mongoose/model config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	//current date
	created: {
		type: Date, 
		default: Date.now
	} 
});

//compile thescame into model
//Blog   conventional name with cabital letter
//Blog insite the parenthesis is db name which will be automatically  save in pulrs Blogs
var Blog = mongoose.model("Blog", blogSchema);

//single create of blog

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg?h=350&auto=compress&cs=tinysrgb",
// 	body: "“At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi,"

// });



//REST Routes
//home
app.get("/", function(req, res){
	res.redirect("/blogs");
});

//Index route list all the blogs
app.get("/blogs", function(req, res){
	//retrive all blogs from db
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR");
		}else{
			res.render("index",{ blogs: blogs });
		}
	});
	
});

//new routes shows theforms
app.get("/blogs/new", function(req, res){
	//render to the form
	res.render("new");
});


//post route will create the blog  and redirect to index
app.post("/blogs", function(req, res){
	//create new Blogs
	// req.body.body = req.sanitize(req.body.body);
	Blog.create({
		title:  req.body.title,
		image:  req.body.image,
 		body :  req.sanitize(req.body.body)
		}, function(err, newBlogs){
			if(err){
				console.log(err);
				res.redirect("new");
			}else{
				//redirect to the index
				res.redirect("/blogs");
			}
 	});

});


//show route
app.get("/blogs/:id", function(req, res){
	//find the paticular blog 
	Blog.findById(req.params.id, function(err, newFoundBlog){
		if(err){
			//display error 
			console.log(err);
			res.redirect("/blogs");
		}else{
			//redirect to show page and passing blog
			res.render("show",{blog:newFoundBlog});
		}
	});

});

//edit route
app.get("/blogs/:id/edit", function(req, res){
	//find the blog
	Blog.findById(req.params.id, function(err, newFoundBlog){
		if(err){
			console.log(err);
			//res.redirect("/blogs");
		}else{
			//render new edit page with blog
			res.render("edit",{blog:newFoundBlog});
		}
	});
	
});

//update route using _method=PUT method-overrideing instead of post with update route naem
app.put("/blogs/:id", function(req, res){
	//find the existing blog 
	//Blog.findByIdAndUpdate(id, newData, callback);
	Blog.findByIdAndUpdate(req.params.id, 
		{
			title: req.body.title,
			image: req.body.image,
			body : req.sanitize(req.body.body)
		},
		function(err,updatedBlog){
			if(err){
				res.direct("/blogs");
			}
			else{
				//show page
				res.redirect("/blogs/"+ req.params.id);
			}
	});
});

//delte route blogs/5a8d41855d6604131c8b8f76
app.delete("/blogs/:id", function(req, res){
	//find the blog with id and then delete
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
	//redirect
});



//listen the portvar cPort= 3000;
app.listen(3000, function(){
	console.log("your restful app is running ");

});