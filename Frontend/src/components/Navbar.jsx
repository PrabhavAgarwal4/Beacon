import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { logoutUser } from '../services/userService';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await logoutUser();
      if (setUser) setUser(null); 
      navigate("/login"); 
    } catch (error) {
      console.error("Logout failed:", error);
      
      if (setUser) setUser(null);
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">
              BEACON
            </Link>
          </div>

          {/* Links and User Actions */}
          <div className="hidden md:flex space-x-8 items-center">
            {/* ... keep your existing Student/Recruiter links ... */}

            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;