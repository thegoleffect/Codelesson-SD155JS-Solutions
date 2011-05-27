var twitter = require("twitter");
var twit = new twitter({
  consumer_key: "CONSUMER_KEY_GOES_HERE",
  consumer_secret: "CONSUMER_SECRET_GOES_HERE",
  access_token_key: "ACCESS_TOKEN_KEY_GOES_HERE",
  access_token_secret: "ACCESS_TOKEN_SECRET_GOES_HERE"
})

console.log("Hello world");

twit.updateStatus("Hello world", function(){
  // All done!
})