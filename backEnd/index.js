const express = require('express')
const cors = require('cors')
const socketio =  require('socket.io')
const http = require('http')
const port = process.env.PORT || 8002
const router = require('./server')
const app = express();
app.use('*',cors())
const server = http.createServer(app);
const io = socketio(server)
const {addUser , deleteUser, getUser, getUserInRoom} = require('./user')

io.on('connection',(socket)=>{
  console.log("new connection")

  socket.on('join',({name , room}, callback) => {
    console.log(name, room, "user")
    const {error , user} = addUser({id:socket.id, name: name, room: room})
    if(error){
      console.log(error)
      return callback({error:error})
    }
    console.log(user)
  });

  socket.on('disconnect',()=>{
    console.log("user has left")
    deleteUser(socket.id)
  })
})



app.use(router)



server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
