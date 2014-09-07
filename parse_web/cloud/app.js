// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// Global app configuration section
app.set('view engine', 'jade');    // Set the template engine
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.use(express.bodyParser());    // Middleware for reading request body

console.log(app.get('env'));
if (app.get('env') == 'local_development') {
  Parse = require('parse').Parse; // global scope for modules(controllers and models)
  Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);

  require_base_path = '.';
} else {
  require_base_path = 'cloud';
}

var items_controller = require(require_base_path + '/controllers/items_controller');

app.get('/', function(req, res) {
  template_vars["message"] = "めっさげ";
  res.render('hello', template_vars);
});

app.get('/items/index', items_controller.index);
app.get('/items/show/:id', items_controller.show);

app.get('/items/new', items_controller.new);
app.post('/items/create', items_controller.create);

app.get('/items/edit/:id', items_controller.edit);
app.post('/items/update', items_controller.update);

app.post('/items/destroy', items_controller.destroy);

// Attach the Express app to Cloud Code.
app.listen(3000);
