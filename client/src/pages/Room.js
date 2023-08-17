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

  /**
   * Functions
   */

  /**
   * triggered when we recieve (emit) that a new user joined the room
   * */
  const handleNewUserJoined = useCallback(({ roomId, user }) => {
    console.log(`new user ${user} joined this room ${roomId}`)
  }, [])

  /**
   * triggered when we recieve list of all participants in the room
   * it is recieved when a new user joins
   * */
  const handleParticipants = useCallback((users) => {
    setOnlineUsers(users)
    console.log(`participants in the room ${users}`)
  }, [])

  /**
   * triggered when we recieve (emit) that a user left the room
   * */
  const handleDisconnect = useCallback(() => {
    navigate('/dashboard')
  }, [navigate])

  useEffect(() => {
    socket.on('newUser:joined', handleNewUserJoined)
    socket.on('participants', handleParticipants)
    socket.on('disconnect', handleDisconnect)
    // socket.on('incoming:call', handleIncoming)
    // socket.on('call:accepted', handleCallAccepted)

    return () => {
      socket.off('newUser:joined', handleNewUserJoined)
      socket.off('participants', handleParticipants)
      socket.off('disconnect', handleDisconnect)
      // socket.off('incoming:call', handleIncoming)
      // socket.off('call:accepted', handleCallAccepted)
    }
  }, [socket, handleNewUserJoined, handleParticipants, handleDisconnect])

  return (
    <>
      <div className="align:center">
        <div className="flex">
          <div className="left-container w-3/5">
            <div>Room {roomId}</div>
            {/* <div>
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
            </div> */}
          </div>
          <div className="right-container w-2/5">
            <h2>Online Users</h2>
            <div>
              {onlineUsers &&
                onlineUsers.map((participant, index) => {
                  return <div key={index}>{participant}</div>
                })}
            </div>
          </div>

          <div></div>
        </div>
      </div>
    </>
  )
}

export default Room
/**
 * Function to initiate calling
 */
// const handleCalling = useCallback(async () => {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     })
//     const offer = await peer.getOffer()
//     socket.emit('outgoing:call', { offer })
//     setMyStream(stream)
//   } catch (error) {
//     console.error('Error accessing media devices:', error)
//   }
// },[socket])

/**
 * handle incoming call
 */

// const handleIncoming = useCallback(
//   async ({ offer }) => {
//     try {
//       if (offer) {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true,
//         })
//         setMyStream(stream)
//       }

//       const answer = await peer.getAnswer(offer)
//       socket.emit('call:accepted', { answer })
//     } catch (error) {
//       console.log('Invalid incoming offer:', offer)
//     }
//   },
//   [socket]
// )

/**
 * handle call accepted
 */
// const handleCallAccepted = useCallback(({ answer }) => {
//   try {
//     peer.setLocalDesc(answer)
//     console.log('call accepted')
//   } catch (error) {
//     console.log(error)
//   }
// }, [])
