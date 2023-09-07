import React from 'react'

const Avatar = ({ username }) => {
  return (
    <div className="avatar online placeholder">
      <div className="w-6 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
        <span className="text-xl">{username[0]}</span>
      </div>
    </div>
  )
}

export default Avatar
