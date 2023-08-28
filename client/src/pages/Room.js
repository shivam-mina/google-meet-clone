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

  const [remoteSocketId, setRemoteSocketId] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [myStream, setMyStream] = useState(null)
  /** util */

  /**
   * Functions
   */

  /**
   * triggered when we recieve (emit) that a new user joined the room
   * */
  const handleNewUserJoined = useCallback(({ roomId, user, socketId }) => {
    console.log(
      `new user ${user} joined this room ${roomId}: socketId: >>>>> ${socketId}`
    )
    setRemoteSocketId(socketId)
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

  /**
   * --------
   */
  const handleCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
    const offer = await peer.getOffer()
    socket.emit('user:call', { to: remoteSocketId, offer: offer })
    setMyStream(stream)
  }, [remoteSocketId, socket])

  /**
   * ----------
   */

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })
      setMyStream(stream)
      console.log(
        `Incoming call from ${from} with offer: >> ${JSON.stringify(offer)}`
      )
      const ans = await peer.getAnswer(offer)

      socket.emit('call:accepted', { to: from, ans: ans })
    },
    [socket]
  )

  /**
   * --------
   */
  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDesc(ans)
      console.log('Call Accepted')
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream)
      }
    },
    [myStream]
  )

  /**
   * -------
   */

  useEffect(() => {
    peer.peer.addEventListener('track', async (ev) => {
      const remoteStream = ev.streams
      setRemoteStream(remoteStream)
    })
  }, [])

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer()
    socket.emit('peer:nego:needed', { offer, to: remoteSocketId })
  }, [remoteSocketId, socket])

  const handleNegoIncoming = useCallback(
    ({ from, offer }) => {
      const ans = peer.getAnswer(offer)
      socket.emit('peer:nego:done', { to: from, ans })
    },
    [socket]
  )

  const handleNegoFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDesc(ans)
  }, [])

  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded)

    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded)
    }
  }, [handleNegoNeeded])

  useEffect(() => {
    socket.on('newUser:joined', handleNewUserJoined)
    socket.on('participants', handleParticipants)
    socket.on('disconnect', handleDisconnect)
    socket.on('incoming:call', handleIncomingCall)
    socket.on('call:accepted', handleCallAccepted)
    socket.on('peer:nego:needed', handleNegoIncoming)
    socket.on('peer:nego:final', handleNegoFinal)

    return () => {
      socket.off('newUser:joined', handleNewUserJoined)
      socket.off('participants', handleParticipants)
      socket.off('disconnect', handleDisconnect)
      socket.off('incoming:call', handleIncomingCall)
      socket.off('call:accepted', handleCallAccepted)
      socket.off('peer:nego:needed', handleNegoIncoming)
      socket.off('peer:nego:final', handleNegoFinal)
    }
  }, [
    socket,
    handleNewUserJoined,
    handleParticipants,
    handleDisconnect,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoIncoming,
    handleNegoFinal,
  ])

  return (
    <>
      <div className="align:center">
        <div className="flex">
          <div className="left-container w-3/5">
            <div>Room {roomId}</div>
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

          {remoteSocketId ? <div>Connected</div> : <div>No one in room</div>}
          {remoteSocketId && <button onClick={handleCall}>Call</button>}
        </div>
        <div>
          {myStream && (
            <div>
              <h1>My Stream</h1>
              <ReactPlayer
                playing
                muted
                height="300px"
                width="300px"
                url={myStream}
              />
            </div>
          )}
          {remoteStream && (
            <div>
              <h1>Remote Stream</h1>
              <ReactPlayer
                playing
                muted
                height="300px"
                width="300px"
                url={remoteStream}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Room