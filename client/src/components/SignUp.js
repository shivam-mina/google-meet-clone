import React, { useState } from 'react'
import axios from 'axios'

const SignUp = ({setLogin}) => {
  const [input, setInput] = useState({
    email: '',
    password: '',
    username: '',
  })
  const { email, password, username } = input

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/users/signup', { username, email, password })

      if (data.message === 'success') {
        setLogin(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setInput({ ...input, [name]: value })
  }
  return (
    <div className="right-container p-8 text-center mr-16 mt-32">
      <div className="right-container-title text-2xl font-bold leading-none tracking-tight  md:text-2xl lg:text-2xl dark:text-black">
        Sign-Up to create your account
      </div>
      <div className="right-container-form">
        <form onSubmit={handleLogin}>
          <div className="right-container-input">
            <input
              type="username"
              name="username"
              value={username}
              placeholder="Enter username"
              onChange={handleOnChange}
              className="w-2/3 px-4 py-2 mt-7 bg-transparent text-base border-2 border-black focus:outline-none focus:border-white placeholder-slate-950 font-semibold"
            />
          </div>
          <div className="right-container-input">
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter Email"
              onChange={handleOnChange}
              className="w-2/3 px-4 py-2 mt-7 bg-transparent text-base border-2 border-black focus:outline-none focus:border-white placeholder-slate-950 font-semibold"
            />
          </div>
          <div className="right-container-input">
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter Password"
              onChange={handleOnChange}
              className="w-2/3 px-4 py-2  mt-7 bg-transparent text-base border-2 border-black focus:outline-none focus:border-white placeholder-slate-950 font-semibold"
            />
          </div>

          <button
            type="submit"
            className="bg-black hover:bg-transparent text-white hover:text-black font-semibold text-blacks py-2 px-4 border border-black rounded mt-8"
          >
            SignUp
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp
