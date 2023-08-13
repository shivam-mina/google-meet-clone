import React, { useEffect, useCallback, useState } from 'react'
import { useSocket } from '../context/SocketProvider'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import peer from '../service/peer'

const Room = () => {
  /** User variables */
  const socket = useSocket()
  const navigate = useNavigate()
  const { roomId } = useParams()

  const [onlineUsers, setOnlineUsers] = useState([])
  const [myStream, setMyStream] = useState()
  /** util */
  const keyValueArray = Object.entries(onlineUsers)

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
  const handleNewUserJoined = useCallback(() => {
    getOnlineUsers()
  }, [])

  /**
   * triggered when we recieve (emit) that a user left the room
   * */
  const handleDisconnect = useCallback(() => {
    getOnlineUsers()
    navigate('/dashboard')
  }, [navigate])

  /**
   * Function to initiate calling
   */
  const handleCalling = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })
      const offer = await peer.getOffer()
      socket.emit('outgoing:call', { offer })
      setMyStream(stream)
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }, [socket])

  /**
   * handle incoming call
   */

  const handleIncoming = useCallback(
    async ({ offer }) => {
      try {
        if (offer) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          })
          setMyStream(stream)
        }

        const answer = await peer.getAnswer(offer)
        socket.emit('call:accepted', { answer })
      } catch (error) {
        console.log('Invalid incoming offer:', offer)
      }
    },
    [socket]
  )

  /**
   * handle call accepted
   */
  const handleCallAccepted = useCallback(({ answer }) => {
    try {
      peer.setLocalDesc(answer)
      console.log('call accepted')
    } catch (error) {
      console.log(error)
    }
  }, [])

  // when page loads
  useEffect(() => {
    getOnlineUsers()
  }, [])

  useEffect(() => {
    socket.on('new-user:joined', handleNewUserJoined)
    socket.on('incoming:call', handleIncoming)
    socket.on('call:accepted', handleCallAccepted)
    socket.on('disconnect', handleDisconnect)

    return () => {
      socket.off('new-user:joined', handleNewUserJoined)
      socket.off('incoming:call', handleIncoming)
      socket.off('call:accepted', handleCallAccepted)
      socket.off('disconnect', handleDisconnect)
    }
  }, [
    socket,
    handleNewUserJoined,
    handleDisconnect,
    handleIncoming,
    handleCallAccepted,
  ])

  return (
    <>
      <div className="align:center">
        <div className="flex">
          <div className="left-container w-3/5">
            <div>Room {roomId}</div>
            <div>
              <button
                onClick={handleCalling}
                className="bg-black text-white font-semibold py-2 px-4 mt-6"
              >
                Join Call
              </button>
              <div className="bg-gray-400  ml-10 mt-6 ">
                <div>
                  <>
                    <h1>My Video stream</h1>
                    {myStream && (
                      <ReactPlayer
                        playing
                        muted
                        url={myStream}
                        height="200px"
                        width="200px"
                      />
                    )}
                  </>
                </div>
              </div>
            </div>
          </div>
          <div className="right-container w-2/5">
            <h2>Online Users</h2>
            <div>
              {keyValueArray.map(([key, value]) => (
                <div key={key}>
                  {key}: {value}
                </div>
              ))}
            </div>
          </div>

          <div></div>
        </div>
      </div>
    </>
  )
}

export default Room
