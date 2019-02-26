const express = require("express");
const app = express();

//process.env.PORT is what you are assigned
const port = process.env.PORT || 8800;

//in server package.json
//add "start": "node index.js" in scripts
//if you have more than one "start": "node index.js; blahh blah blah"

const server = app.listen(port, (err)=>{
    if(err){
        console.log(err);
        return false;
    }
    console.log(port+" is opened");
});

var io = require("socket.io")(server);

//io.on("connection", (socket)=>{
//  console.log(socket.id + " connected");
//  
//  socket.on("my_sticker", (data)=>{
//    io.emit("sticker_recieved", data);
//  });
//  
//});


//NAMESPACE used to organize better
//ROOMS strictly filter without font end doing anything
//  socket.join("name of room") is how you join a room
//  io.to("name of room").emit() to communicate
//  socket.leave("name of room") to leave the room

var stspace = io.of("/sticker");
var num = 0;

stspace.on("connection", (socket)=>{
  console.log(socket.id + " connected");
//  num ++;
//  if(num < 3){
//    socket.join("room1");
//  } else {
//    socket.join("room2");
//  }
  socket.on("join_room", (data)=>{
    socket.join(data.roomName);
  });
  
  socket.on("my_sticker", (data)=>{
    stspace.to(data.roomName).emit("sticker_recieved", data);
  });
});

var chatspace = io.of("/chat");
chatspace.on("connection", (socket)=>{
  console.log(socket.id + " connected");
  
  socket.on("typed_msg", (data)=>{
    chatspace.emit("new_msg", data);
    
//    can still talk to other space
//    stspace.emit("new_chat_sticker", data);
  });
});



