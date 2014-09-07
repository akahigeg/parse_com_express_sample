var template_vars = { title: 'Parse.com Express Sample', description: '', keywords: 'Parse.com Express Sample', robots: '' };

exports.index = function(req, res) {
  var items = [];
  var query = new Parse.Query("Item");
  query.each(function(item) {
    items.push(item);
  }).then(function(){
    template_vars["items"] = items;
    res.render('items/index', template_vars);
  });
}

exports.show = function(req, res) {
  var item;
  var query = new Parse.Query("Item");
  query.equalTo("objectId", req.params.id);
  query.first({
    success: function(item) {
      template_vars["item"] = item;
      res.render('items/show', template_vars);
    },
    error: function() {
      response.error("item lookup failed");
    }
  });
}

exports.new = function(req, res) {
  res.render('items/new', template_vars);
}

exports.create = function(req, res) {
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
}

exports.edit = function(req, res) {
  var query = new Parse.Query("Item");
  query.equalTo("objectId", req.params.id);
  query.first({
    success: function(item) {
      template_vars["item"] = item;
      res.render('items/edit', template_vars);
    },
    error: function() {
      response.error("item lookup failed");
    }
  });
}

exports.update = function(req, res) {
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
}

exports.destroy = function(req, res) {
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
}
