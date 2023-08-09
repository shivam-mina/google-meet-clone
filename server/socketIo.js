const emailToSocketMapping = new Map()
const socketToEmailMapping = new Map()

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
      console.log('Socket Conneted: ', socket.id)
      const { roomId, emailId } = data

      console.log('User: ', emailId, ' Joined room: ', roomId)

      emailToSocketMapping.set(emailId, socket.id)
      socketToEmailMapping.set(socket.id, emailId)

      io.to(roomId).emit('new-user:joined', {
        emailId,
        id: socket.id,
        roomId: roomId,
      })
      socket.join(roomId)
      io.to(socket.id).emit('user:joined', { success: true, roomId: roomId })

      // handling discoonect event
      socket.on('disconnect', () => {
        const emailId = socketToEmailMapping.get(socket.id)
        if (emailId) {
          console.log('User Disconnected: ', emailId)

          emailToSocketMapping.delete(emailId)
          socketToEmailMapping.delete(socket.id)
        }
      })
    })
  })
}

module.exports = {
  emailToSocketMapping,
  socketServer,
}
