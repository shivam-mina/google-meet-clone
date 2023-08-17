import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { useSocket } from '../context/SocketProvider'

const Dashboard = () => {
  const navigate = useNavigate()
  const socket = useSocket()

  const [profileData, setProfileData] = useState('')
  const [roomId, setRoomId] = useState('')

  // Fetch User Profile from headers token
  const fetchUserProfile = async () => {
    const { data } = await axios.get('/users/profile')
    setProfileData(data.user)
  }
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const handleOnChange = (e) => {
    setRoomId(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('user:join', {
      username: profileData.username,
      emailId: profileData.email,
      roomId: roomId,
    })
  }

  const handleUserJoined = useCallback(
    ({ roomId, success, socketId }) => {
      console.log(`${socketId} joined ${roomId}`)
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
    <div className="h-screen">
      <div className="flex h-screen">
        <div className="left-container w-3/5">
          <div className="w-20 h-20 mt-32 ml-7 left-container-logo">
            <img
              src={require('../assets/HelioCall-logos/helio-logo.png')}
              alt="helio-logo"
            />
          </div>
          <div className="left-container-title ml-20 mb-4 text-4xl font-light leading-none tracking-tight md:text-5xl lg:text-6xl dark:text-black">
            welcome {profileData.username}
          </div>
          <div className="left-container-title ml-20 mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl dark:text-black">
            Premium Video Calls.
            <br /> Now for Everyone.
          </div>
          <div className="flex items-center ml-20 mt-10">
            <div className="left-container-button ml-4">
              <button
                onClick={handleSubmit}
                className="bg-black hover:bg-transparent text-white hover:text-black font-semibold text-blacks py-2 px-4 border border-black rounded"
              >
                Create New Room
              </button>
            </div>

            <div className="left-container-desc flex ml-4 items-center">
              <div className="left-container-inputs">
                <input
                  value={roomId}
                  name="roomId"
                  onChange={handleOnChange}
                  type="text"
                  placeholder="Enter Room code"
                  className="w-full px-4 py-2 bg-transparent text-base border-2 border-black focus:outline-none focus:border-white placeholder-slate-950 font-semibold"
                />
              </div>
              <div className="left-container-button">
                {roomId !== '' && (
                  <button
                    onClick={handleSubmit}
                    className="bg-gray hover:bg-transparent text-white hover:text-black font-semibold text-blacks py-2 px-4 "
                  >
                    Enter Room
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="right-container w-2/5"></div>
      </div>
    </div>
  )
}

export default Dashboard
