import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { logoutUser } from '../services/userService';

const Navbar = () => {
  const { user} = useContext(AuthContext); // Ensure your AuthContext has a logout function
  const navigate = useNavigate();

  const handleLogout = async () => {
    alert("Logout clicked");
    await logoutUser();
    alert("Logout done")
    navigate('/login');
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

          {/* Dynamic Links(Diff for student and recruiter) */}
          <div className="hidden md:flex space-x-8 items-center">
            {user?.role === "STUDENT" && (
              <>
                <Link to="/job" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Jobs</Link>
                <Link to="/applications" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Applications</Link>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Profile</Link>
              </>
            )}
            
            {user?.role === "RECRUITER" && (
              <>
                <Link to="/post-job" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Post Job</Link>
                <Link to="/my-jobs" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">My Listings</Link>
              </>
            )}

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