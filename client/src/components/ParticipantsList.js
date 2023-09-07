import React from 'react'
import Avatar from './Avatar'

const ParticipantsList = ({ participantsInRoom }) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-slate-800 h-full">
        {participantsInRoom.map((username) => (
          <div
            className={`pt-2 pl-3 pb-2 border-b border-slate-700 flex items-center gap-2 cursor-pointer`}
            key={username}
          >
            <div className="flex gap-2 py-2 pl-4 items-center">
              <Avatar username={username} />
              <div className='ml-2 font-semibold'>
              {username}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="bg-slate-200 h-2/3 border border-2 border-black rounded-md">Chat</div> */}
    </div>
  )
}

export default ParticipantsList
