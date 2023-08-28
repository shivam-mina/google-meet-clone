const socketToUserMapping = new Map()
const rooms = new Map()
const socketServer = (server) => {
  // Setting up Socket-io
  const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    socket.on('user:join', (data) => {
      const { username, emailId, roomId } = data
      console.log(
        'User: ',
        username,
        ' Email: ',
        emailId,
        ' Joined room: ',
        roomId
      )

      // Join the room
      socket.join(roomId)

      /** If room is not existing , then we create a new set
       * to store all the users in that room
       * We are using like map <roomid ,set <userid>>
       */

      if (!rooms.get(roomId)) {
        rooms.set(roomId, new Set())
      }

      // Now get the room set and add user to it
      rooms.get(roomId).add(username)
      socketToUserMapping.set(socket.id, username)

      // Now we tell the user that he has joined the room
      io.to(socket.id).emit('user:joined', {
        roomId,
        success: true,
        socketId: socket.id,
      })

      // Now we notify all the users in room about the new user
      io.to(roomId).emit('newUser:joined', {
        roomId,
        user: username,
        socketId: socket.id,
      })

      // Sending list of all room members to new user joined
      io.in(roomId).emit('participants', Array.from(rooms.get(roomId)))
    })
    socket.on('disconnect', () => {
      const user = socketToUserMapping.get(socket.id)
      // Remove the user from the room set
      for (const [roomId, users] of rooms) {
        if (users.has(user)) {
          users.delete(user)
          socketToUserMapping.delete(socket.id)
          console.log(`User -- ${user} left`)
          io.to(roomId).emit('user-left', socket.id)
          io.in(roomId).emit('participants', Array.from(users))
          if (users.size === 0) {
            rooms.delete(roomId)
          }
          break
        }
      }
    })
    // Signaling events
    socket.on('offer', (roomId, userId, offer) => {
      socket.to(userId).emit('offer', offer)
    })

    socket.on('answer', (roomId, userId, answer) => {
      socket.to(userId).emit('answer', answer)
    })

    socket.on('ice-candidate', (roomId, userId, candidate) => {
      socket.to(userId).emit('ice-candidate', candidate)
    })

    socket.on('user:call', ({ to, offer }) => {
      io.to(to).emit('incoming:call', { from: socket.id, offer })
    })
    socket.on('call:accepted', ({ to, ans }) => {
      io.to(to).emit('call:accepted', { from: socket.id, ans })
    })
    socket.on('peer:nego:needed', ({ to, offer }) => {
      io.to(to).emit('peer:nego:needed', { from: socket.id, offer })
    })
    socket.on('peer:nego:done', ({ to, ans }) => {
      io.to(to).emit('peer:nego:final', { from: socket.id, ans })
    })
  })
}

module.exports = {
  socketServer,
}