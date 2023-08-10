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
      <div className="h-screen">
        <div className="flex h-screen">
          <div className="left-container w-3/5">
            <div className="w-20 h-20 mt-32 ml-7 left-container-logo ">
              <img
                src={require('../assets/HelioCall-logos/helio-logo.png')}
                alt="helio-logo"
              />
            </div>
            <div className="left-container-title  ml-20 mb-4 text-4xl font-extrabold leading-none tracking-tight  md:text-5xl lg:text-6xl dark:text-black">
              Premium Video Calls.
              <br /> Now for Everyone.
            </div>
            <div className="left-container-desc"></div>
            <div className="left-container-inputs ml-32">
              <div className="left-container-input">
                <input
                  value={emailId}
                  name="emailId"
                  onChange={handleOnChange}
                  type="email"
                  placeholder="Enter Your Name"
                  className="w-1/3 px-4 py-2 mt-7 bg-transparent text-base border-2 border-black focus:outline-none focus:border-white placeholder-slate-950 font-semibold"
                />
              </div>
              <div className="left-container-input">
                <input
                  value={roomId}
                  name="roomId"
                  onChange={handleOnChange}
                  type="text"
                  placeholder="Enter Room code"
                  className="w-1/3 px-4 py-2 mt-7 bg-transparent text-base border-2 border-black focus:outline-none focus:border-white placeholder-slate-950 font-semibold"
                />
              </div>
            </div>
            <div className="left-container-button ml-48">
              <button
                onClick={handleSubmit}
                className="bg-black hover:bg-transparent text-white hover:text-black font-semibold text-blacks py-2 px-4 border border-black rounded mt-8"
              >
                Enter Room
              </button>
            </div>
          </div>
          <div className="right-container w-2/5"></div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
