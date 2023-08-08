import { Routes, Route } from 'react-router-dom'
import axios from 'axios'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Room from './pages/Room'

function App() {
  axios.defaults.baseURL = "http://localhost:5000/api"
  axios.defaults.withCredentials = true;
  return (
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </div>
  )
}

export default App
