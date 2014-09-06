
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// Global app configuration section
app.set('view engine', 'jade');    // Set the template engine
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.use(express.bodyParser());    // Middleware for reading request body

console.log(app.get('env'));
if (app.get('env') == 'local_development') {
  var Parse = require('parse').Parse;
  Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);
}

var template_vars = { title: 'Parse.com Express Sample', description: '', keywords: 'Parse.com Express Sample', robots: '' };

app.get('/', function(req, res) {
  template_vars["message"] = "めっさげ";
  res.render('hello', template_vars);
});

// 特にRESTにこだわらない Rails風味で
// https://github.com/expressjs/express-resourceを見つけたが今回は勉強がてら自前で実装
// TODO: モジュールとして分離
app.get('/items/index', function(req, res) {
  var items = [];
  var query = new Parse.Query("Item");
  query.each(function(item) {
    items.push(item);
  }).then(function(){
    template_vars["items"] = items;
    res.render('item/index', template_vars);
  });
});

app.get('/items/show/:id', function(req, res) {
  var item;
  var query = new Parse.Query("Item");
  query.equalTo("objectId", req.params.id);
  query.first({
    success: function(item) {
      template_vars["item"] = item;
      res.render('item/show', template_vars);
    },
    error: function() {
      response.error("item lookup failed");
    }
  });
});

app.get('/items/new', function(req, res) {
  res.render('item/new', template_vars);
});

app.post('/items/create', function(req, res) {
  var Item = Parse.Object.extend("Item");
  var item = new Item();
  item.save({name: req.body.name}, {
    success: function(object) {
      res.redirect("/items/index");
    },
    error: function(object, error) {
      console.log("item create failed. error code: " + error.code);
      res.redirect("/items/index");
    }
  });
});

app.get('/items/edit/:id', function(req, res) {
  var query = new Parse.Query("Item");
  query.equalTo("objectId", req.params.id);
  query.first({
    success: function(item) {
      template_vars["item"] = item;
      res.render('item/edit', template_vars);
    },
    error: function() {
      response.error("item lookup failed");
    }
  });
});

app.post('/items/update', function(req, res) {
  var query = new Parse.Query("Item");
  query.equalTo("objectId", req.body.id);
  query.first({
    success: function(item) {
      item.set("name", req.body.name);
      item.save();
      res.redirect("/items/index");
    },
    error: function() {
      response.error("item lookup failed");
    }
  });
});

app.get('/items/destroy/:id', function(req, res) {
  var query = new Parse.Query("Item");
  query.equalTo("objectId", req.params.id);
  query.first({
    success: function(item) {
      item.destroy({
        success: function(item) {
          res.redirect("/items/index");
        },
        error: function(item, error) {
          console.log("item destroy failed. error code: " + error.code);
        }
      });
    },
    error: function() {
      response.error("item lookup failed");
    }
  });
  // TODO: プロテクトされたItemは削除できない エラー表示
});

app.post('/items/destroy/:id', function(req, res) {
    // Itemのプロテクト
});

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen(3000);
