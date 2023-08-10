import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketProvider'

const Dashboard = () => {
  const [input, setInput] = useState({
    emailId: '',
    roomId: '',
  })

  const { emailId, roomId } = input

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setInput({ ...input, [name]: value })
  }

  const navigate = useNavigate()

  const socket = useSocket()

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('user:join', { emailId: emailId, roomId: roomId })
  }

  const handleUserJoined = useCallback(
    ({ roomId, success }) => {
      console.log(roomId)
      if (success) {
        navigate(`/room/${roomId}`)
      }
    },
    [navigate]
  )

  useEffect(() => {
    socket.on('user:joined', handleUserJoined)

    return () => {
      socket.off('user:joined', handleUserJoined)
    }
  }, [socket, handleUserJoined])

  return (
    <>
      <div>
        <input
          value={emailId}
          name="emailId"
          onChange={handleOnChange}
          type="email"
          placeholder="Enter Email Id"
        />
        <input
          value={roomId}
          name="roomId"
          onChange={handleOnChange}
          type="text"
          placeholder="Enter Room code"
        />
        <button onClick={handleSubmit}>Enter Room</button>
      </div>
    </>
  )
}

export default Dashboard
