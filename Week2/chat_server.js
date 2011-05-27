var connect = require("connect")
var express = require("express")
var fs = require("fs")
var io = require("socket.io")

var port = 3000;
var log = []; // Chat log (clears on server restart)

function main(app){
  app.get("/", function(req, res){
    // read html file and send it to user's browser
    fs.readFile("./chat_server.html", function(err, data){
      res.send(data.toString()) // could have pre-populated this with the chat log
    })
  })
  
  app.get("/log.json", function(req, res){
    res.send(log) // send historical chat log
  })
  
  // this function handles the case where 
  app.post("/chat", function(req, res){
    log.push(req.body.message) // does not live-update
  })
}

var server = express.createServer(
  connect.logger(),
  connect.bodyParser()
)

server.use(connect.router(main));
server.listen(port)
console.log("Connect server listening on port " + port);

var socket = io.listen(server) // initialize socket.io
socket.on("connection", function(client){ // on connection, register client
  client.on("message", function(msg){ // on message, log it and broadcast to all clients
    log.push(msg)
    client.broadcast(msg) // Does not send msg back to sender
    // client.send(msg) // Could send the msg back to user
  })
})