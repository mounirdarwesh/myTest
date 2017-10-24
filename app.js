const express = require ('express'); //It is like a library in C#
const path = require ('path');
const mongoose = require ('mongoose');
var bodyParser = require('body-parser')


mongoose.connect('mongodb://127.0.0.1:27017');
let db = mongoose.connection;

//Check connection
db.once('open',function(){
  console.log('Connected to Mongodb');
});

//Check for connection
db.on('error' ,function(err){
  console.log(err);
})

// init App
const app = express();

//Bring the models
let ArticleDB = require ('./models/article');

//Load View Engine
app.set('views', path.join(__dirname, 'views') ); //Set the path of the default folder
app.set('view engine', 'pug'); //Define which language

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Set public folder
app.use(express.static(path.join(__dirname,'public')));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Home Route (Index.pug)..
app.get('/', function (req, res){ //it is work like a module or a methode and has a view
  /*let articles = [
    {
      id : 1,
      title : 'article one',
      author : 'Mounir',
      body : 'This is article One'
    },
    {
      id : 2,
      title : 'article two',
      author : 'Mounir',
      body : 'This is article gh'
    },
    {
      id : 3,
      title : 'article Three',
      author : 'Mounir',
      body : 'This is article g'
    }
  ]; */
  ArticleDB.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Articles',
        articles: articles
      });
    }
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Get single Article (article.pug)
app.get('/article/:id', function(req, res){
  ArticleDB.findById(req.params.id, function(err, article){
    res.render('article',{
      article:article
    // console.log(article);
    // return;
    });
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Add Route (add_article.pug)
app.get('/articles/add', (req, res) => {
  res.render('add_article',{
    title:('Add Article')
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//redirect
/*app.get('/articles/add', (req, res) =>{
  res.redirect('/articles/add');
});*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Add submit POST Route (add_article.pug form)
app.post('/articles/add', function(req, res){
  let article = new ArticleDB();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    }else {
      res.redirect('/');
      console.log('Submitted!');
    }
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Load edit form (article_edit.pug) just load data
app.get('/article/edit/:id', function(req, res){
  ArticleDB.findById(req.params.id, function(err, article){
    res.render('edit_article',{
      article:article
    // console.log(article);
    // return;
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Edit submit POST Route (add_article.pug form)
app.post('/articles/edit/:id', function(req, res){
  let article ={};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query ={_id:req.params.id}

  ArticleDB.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }else {
      res.redirect('/');
      console.log('Submitted!');
    }
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Delete article 
app.delete('/article/:id', function(req, res){

  let query ={_id:req.params.id}

  ArticleDB.remove(query, function(err){
    if(err){
      console.log(err);
    }else {
      res.send('Removed!');
    }
  });
});

//Start Server
app.listen(3000,() => { //Turn on the server
  console.log('Server started on port 3000...');
});
