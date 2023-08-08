import React, { useEffect, useCallback } from 'react'
import { useSocket } from '../context/SocketProvider'

const Room = () => {
  const socket = useSocket()

  const handleNewUserJoined = useCallback((data) => {
    console.log(data);
  },[])

  useEffect(() => {
    socket.on('new-user:joined', handleNewUserJoined)

    return () => {
      socket.off('new-user:joined', handleNewUserJoined)
    }
  }, [socket,handleNewUserJoined])

  return <div>Room</div>
}

export default Room
