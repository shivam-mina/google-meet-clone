import { Routes, Route } from 'react-router-dom'
import axios from 'axios'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  axios.defaults.baseURL = "http://localhost:5000/api"
  axios.defaults.withCredentials = true;
  return (
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
  )
}

export default App
