const users = new Map()

module.exports = socketServer = (server) => {
  // Setting up Socket-io
  const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id}`)
    users.set(socket.id, socket.id)

    // emit that a new user has joined as soon as someone joins
    socket.emit('user:joined', { myId: socket.id, usersMap: getUsersArray(users) })

  })

  function getUsersArray(usersMap) {
    return Array.from(usersMap.values());
  }
}
