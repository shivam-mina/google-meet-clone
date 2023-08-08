import './Dashboard.css'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketProvider'

const Dashboard = () => {
  const [emailId, setEmailId] = useState()
  const [roomId, setRoomId] = useState()

  const navigate = useNavigate()

  const socket = useSocket()
  
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("user:join", {emailId: emailId, roomId: roomId})
  }

  const handleUserJoined = useCallback(({roomId, success}) => {
    console.log(roomId);
    if(success) {
      navigate(`/room/${roomId}`)
    }
  },[])

  useEffect(() => {
    socket.on("user:joined", handleUserJoined)

    return () => {
      socket.off("user:joined", handleUserJoined)
    }
  },[socket,handleUserJoined])

  return (
    <>
      <div>
        <input
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          type="email"
          placeholder="Enter Email Id"
        />
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          placeholder="Enter Room code"
        />
        <button onClick={handleSubmit} >Enter Room</button>
      </div>
    </>
  )
}

export default Dashboard
