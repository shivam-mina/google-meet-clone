import React from 'react'

const CommonLeft = ({ setLogin }) => {
  const handleClick = (check) => {
    if (check === 'login') setLogin(true)
    else {
      setLogin(false)
    }
  }
  return (
    <div>
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
          Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem
          cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat
          aliqua. Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure
          qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
          fugiat aliqua.
        </div>
        <div className="left-container-buttons mt-4 flex">
          <div className="left-container-buttons-login">
            <button
              onClick={() => handleClick('login')}
              className="bg-black hover:bg-transparent text-white hover:text-black font-semibold text-blacks py-2 px-4 border border-black rounded ml-12 mr-6"
            >
              Login
            </button>
          </div>
          <div className="left-container-buttons-signup">
            <button
              onClick={() => handleClick('signup')}
              className="bg-transparent hover:bg-black text-black font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommonLeft
