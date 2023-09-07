import React, { useEffect, useCallback, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'

import { useSocket } from '../context/SocketProvider'
import ParticipantsList from '../components/ParticipantsList'
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

  // Send Stream
  const sendStream = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream)
    }
  }, [myStream])

  // Send video
  useEffect(() => {
    peer.peer.addEventListener('track', async (ev) => {
      const remoteStream = ev.streams
      setRemoteStream(remoteStream[0])
    })
  }, [])
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
   * Function to initialize the call and send sdp offer
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

  // const handleTestCall = async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     audio: true,
  //     video: true,
  //   })
  //   const offer = await peer.getOffer()
  //   socket.emit('user:call', { to: remoteSocketId, offer: offer })
  //   setMyStream(stream)
  // }
  // useEffect(() => {
  //   handleTestCall()
  // },[remoteSocketId])

  /**
   * Function to Leave the Stream and End the call
   */
  const stopMyStream = () => {
    
  }
  /**
   * Function to set my stream even if no one is in room
   */

  const handleMyStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
    setMyStream(stream)
  }

  useEffect(() => {
    handleMyStream()
  }, [socket])
  /**
   * Function to recieve the call and answer the sdp offer
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
   * Function to recieve the sdp answer and connect the call
   */
  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDesc(ans)
      console.log('Call Accepted')
      sendStream()
    },
    [sendStream]
  )

  /**
   * For Peer Negotiation
   *  Function to initialize the call and send sdp offer
   */
  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer()
    socket.emit('peer:nego:needed', { offer, to: remoteSocketId })
  }, [remoteSocketId, socket])

  /**
   * For Peer Negotiation
   *  Function to recieve the call and answer the sdp offer
   */
  const handleNegoIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer)
      socket.emit('peer:nego:done', { to: from, ans })
    },
    [socket]
  )
  /**
   * For Peer Negotiation
   * Function to recieve the sdp answer and connect the call
   */
  const handleNegoFinal = useCallback(async ({ ans }) => {
    console.log('handleNegoFinal >> ', ans)
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
    <div className="flex">
      <div className="bg-slate-950 h-screen w-5/6">
        {!remoteSocketId && (
          <div className="mb-4">
            <p className="text-white">You are the only one in the room</p>
          </div>
        )}

        <div className="">
          {remoteStream && (
            <div className="p-10">
              <div className="flex justify-center">
                <ReactPlayer
                  width="58%"
                  height="58%"
                  playing
                  muted
                  url={remoteStream}
                />
              </div>
            </div>
          )}
          {!remoteStream && (
            <div className="p-10">
              <div className="flex justify-center">
                <ReactPlayer
                  width="58%"
                  height="58%"
                  playing
                  muted
                  url={myStream}
                />
              </div>
            </div>
          )}
          {remoteStream && myStream && (
            <div>
              <div className="flex justify-end mr-20">
                <ReactPlayer
                  width="12%"
                  height="12%"
                  playing
                  muted
                  url={myStream}
                />
              </div>
            </div>
          )}
          <div className="flex justify-center ">
            {remoteSocketId && (
              <button onClick={handleCall} class="btn btn-accent mr-10 ml-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 3.75a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V5.56l-4.72 4.72a.75.75 0 11-1.06-1.06l4.72-4.72h-2.69a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            {remoteStream && (
              <button onClick={sendStream} class="btn btn-neutral mr-10 ml-10">
                Send Stream
              </button>
            )}
            <button
              onClick={stopMyStream}
              className="btn btn-circle btn-error mr-10 ml-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M15.22 3.22a.75.75 0 011.06 0L18 4.94l1.72-1.72a.75.75 0 111.06 1.06L19.06 6l1.72 1.72a.75.75 0 01-1.06 1.06L18 7.06l-1.72 1.72a.75.75 0 11-1.06-1.06L16.94 6l-1.72-1.72a.75.75 0 010-1.06zM1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/6">
        <ParticipantsList participantsInRoom={onlineUsers} />
      </div>
    </div>
  )
}

export default Room
