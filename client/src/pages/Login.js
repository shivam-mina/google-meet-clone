import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  const [input, setInput] = useState({
    email: '',
    password: '',
  })
  const { email, password } = input

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/users/login', { email, password })

      if (data.message == 'login success') {
        navigate('/dashboard')
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
    <div>
      <form onSubmit={handleLogin}>
        <label method="post" htmlFor="email">
          Enter Email
        </label>
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Enter Email"
          onChange={handleOnChange}
        />
        <label method="post" htmlFor="password">
          Enter Password
        </label>
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Enter Password"
          onChange={handleOnChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Login
