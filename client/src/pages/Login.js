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

      if (data.message === 'login success') {
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
  // bg-gradient-to-bl from-gray-900 to-gray-500 bg-gradient-to-r
  return (
    <div className="h-screen">
      <div className="flex h-screen">
        <div className="login-left w-3/5 ">
          <div className="left-container p-5 mt-20 ml-8 ">
            <div className="w-20 h-20 left-container-logo ">
              <img
                src={require('../assets/HelioCall-logos/helio-logo.png')}
                alt="helio-logo"
              />
            </div>
            <div className="left-container-title mt-0 ml-10 mb-4 text-4xl font-extrabold leading-none tracking-tight  md:text-5xl lg:text-6xl dark:text-black">
              {' '}
              HelioCall
            </div>
            <div className="left-container-desc text-black p-4 pt-2 ml-7 mr-10">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
              lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
              fugiat aliqua. Anim aute id magna aliqua ad ad non deserunt sunt.
              Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat
              veniam occaecat fugiat aliqua.
            </div>
            <div className="left-container-buttons mt-4 flex">
              <div className="left-container-buttons-login">
                <button className="bg-black hover:bg-transparent text-white hover:text-black font-semibold text-blacks py-2 px-4 border border-black rounded ml-12 mr-6">
                  Login
                </button>
              </div>
              <div className="left-container-buttons-signup">
                <button className="bg-transparent hover:bg-black text-black font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="login-right w-2/5">
          <div className="right-container p-8 text-center mr-16 mt-32">
            <div className="right-container-title text-2xl font-bold leading-none tracking-tight  md:text-2xl lg:text-2xl dark:text-black">
              {' '}
              Login to your account
            </div>
            <div className="right-container-form">
              <form onSubmit={handleLogin}>
                {/* <div className="right-container-label">
                  <label method="post" htmlFor="email">
                    Enter Email
                  </label>{' '}
                </div> */}
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

                {/* <div className="right-container-label">
                  <label method="post" htmlFor="password">
                    Enter Password
                  </label>{' '}
                </div> */}
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
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
