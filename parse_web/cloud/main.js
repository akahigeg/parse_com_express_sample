require('cloud/app.js');
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
//Parse.Cloud.define("hello", function(request, response) {
//  response.success("Hello world!");
//});

Parse.Cloud.define("hello", function(request, response) {
  var Item = Parse.Object.extend("Item");
  var item = new Item();
  item.save({name: "FirstItem"}, {
    success: function(object) {
      response.success('yay');
    },
    error: function(object) {
      response.error('oops');
    }
  });
});
