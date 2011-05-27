var twilio = require("twilio");
var connect = require("connect");
var express = require("express")
var fs = require("fs")

// Get these credentials from your Twilio dashboard
ACCOUNT_SID = "";
AUTH_TOKEN = ""; 

MY_HOSTNAME = "twilio.codelesson.com";  // Must be a valid URL, but doesn't need to be real

var client = new twilio.Client(ACCOUNT_SID, AUTH_TOKEN, MY_HOSTNAME);
var phone = client.getPhoneNumber("xxxxxxxxxx"); // Input your Twilio phone number here
var port = 3000;

// This function encapsulates the sms
function sendSms(recipient, message, callback){
  phone.setup(function(){
    phone.sendSms(recipient, message, null, function(sms){
      callback()
    })
  })
}

function main(app){
  app.get("/", function(req, res){
    fs.readFile("./txt_reminder.html", function(err, data){
      res.send(data.toString())
    })
  })
  
  app.post("/reminder", function(req, res){
    var delay = (parseInt(req.body.delay) || 10) * 1000; // setTimeout deals in milliseconds, convert string to int and *1000
    var message = req.body.message;
    var recipient = req.body.phone_number;
    
    if (recipient != ""){ // make sure recipient isn't blank
      setTimeout((function(){
        sendSms(recipient, message, function(){
          console.log('sent') // print to console when finished
        })
      }), delay)
    }
    
    res.send("Sending in " + req.body.delay + " seconds...") // respond to browser even though SMS has not been sent yet
  })
}

var server = express.createServer(
  connect.logger(), // enable detailed logging in the console
  connect.bodyParser() // enable parsing of POST data
)

server.use(connect.router(main));
server.listen(port);
console.log("Connect server listening on port " + port);