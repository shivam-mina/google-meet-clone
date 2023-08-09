import React, { useEffect, useCallback, useState } from 'react'
import { useSocket } from '../context/SocketProvider'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Room = () => {
  /** User variables */
  const socket = useSocket()
  const [onlineUsers, setOnlineUsers] = useState({})
  const keyValueArray = Object.entries(onlineUsers)
  const [roomId, setRoomId] = useState()
  const navigate = useNavigate()

  /**
   * Functions
   */
  // to get online users
  const getOnlineUsers = async () => {
    try {
      const { data } = await axios.get('/onlineusers', {
        withCredentials: true,
      })
      console.log(data)
      setOnlineUsers(data)
    } catch (error) {
      console.log(`Cannot get online users`, error)
    }
  }

  /**
   * triggered when we recieve (emit) that a new user joined the room
   * */
  const handleNewUserJoined = useCallback((data) => {
    // setRoomId(data.roomId)
    getOnlineUsers()
  }, [])

  /**
   * triggered when we recieve (emit) that a user left the room
   * */
  const handleDisconnect = useCallback(
    (data) => {
      // setOnlineUsers((prevOnlineUsers) => {
      //   const updatedUsers = { ...prevOnlineUsers }
      //   delete updatedUsers[data.emailId]
      //   return updatedUsers
      // })
      getOnlineUsers()
      navigate('/dashboard')
    },
    [navigate]
  )

  // when page loads
  useEffect(() => {
    getOnlineUsers()
  }, [onlineUsers])

  useEffect(() => {
    socket.on('new-user:joined', handleNewUserJoined)
    socket.on('disconnect', handleDisconnect)

    return () => {
      socket.off('new-user:joined', handleNewUserJoined)
      socket.off('disconnect', handleDisconnect)
    }
  }, [socket, handleNewUserJoined, handleDisconnect])

  return (
    <>
      <h1>Room {roomId}</h1>
      <div>
        <h2>Online Users</h2>
        <div>
          {keyValueArray.map(([key, value]) => (
            <div key={key}>
              {key}: {value}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Room
