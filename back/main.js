const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);
const port = 3000;
const ballsGeneration = true;

//Server..
//--------------------

server.listen(port, () => {
  console.log('listening on *:'+port);
});


//Routes..
//----------------------------------------------
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, '../front', 'index.html'));
});


//Sockets...
//-------------------------------------


io.on('connection', async (socket)  => {

  //Proceso en background... asincrono...
  new Promise(async (resolve) => {
    while (ballsGeneration) {
      socket.emit('clean_canvas',true);
      socket.emit('bola1',generateCoords());
      socket.emit('bola2',generateCoords());
      socket.emit('bola3',generateCoords());
      await sleep(1000)
    }
  });
  

  //Hilo sincrono.. (principal)
  console.log('Otros procesos ');
});

//Custom JS Functions...
//-------------------------------------

//Coords generation
function generateCoords(){
  return [getRandomInt(30,570),getRandomInt(30,570)];
}
//min x = 30 , max x = 570 | Canvas front dimensions 
function getRandomInt(max,min) {
  return  parseInt(Math.random() * (max - min) + min);
}
//Function to stop the process n ms
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}