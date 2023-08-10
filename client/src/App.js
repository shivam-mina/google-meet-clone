import { Routes, Route } from 'react-router-dom'
import axios from 'axios'

import Dashboard from './pages/Dashboard'
import Room from './pages/Room'
import LoginAndSignUp from './pages/LoginAndSignUp'

function App() {
  axios.defaults.baseURL = "http://localhost:5000/api"
  axios.defaults.withCredentials = true;
  return (
      <div>
        <Routes>
          <Route path="/" element={<LoginAndSignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </div>
  )
}

export default App
