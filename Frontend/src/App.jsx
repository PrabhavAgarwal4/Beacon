import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/auth/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />

        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 404 Catch-all */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;