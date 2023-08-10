import React, { useState } from 'react'
import CommonLeft from '../components/CommonLeft'
import Login from '../components/Login'
import SignUp from '../components/SignUp'

const LoginAndSignUp = () => {
  const [login, setLogin] = useState(true)

  return (
    <div className="h-screen">
      <div className="flex h-screen">
        <div className="container-left w-3/5 ">
          <CommonLeft setLogin={setLogin} />
        </div>
        <div className="container-right w-2/5">
          {login === true ? <Login /> : <SignUp setLogin={setLogin} />}
        </div>
      </div>
    </div>
  )
}

export default LoginAndSignUp
