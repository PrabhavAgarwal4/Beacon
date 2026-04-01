import React, { useContext } from 'react';
import { Link,Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

const Home = () => {
  const { user } = useContext(AuthContext);
 
  // 1. Guest View (Not Logged In)
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
          Light the way to your <span className="text-blue-600">Future.</span>
        </h1>
        <p className="text-gray-600 text-xl max-w-2xl mb-10">
          Beacon connects the brightest students with top-tier recruiters. 
          Simple, transparent, and built for the next generation of talent.
        </p>
        <div className="flex gap-4">
          <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Get Started
          </Link>
          <Link to="/login" className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold border border-gray-200 hover:bg-gray-50 transition-all">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // 2. Student Dashboard
  if (user.role === "STUDENT") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-gray-500 mb-10">What would you like to do today?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <Link to="/job" className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                🔍
              </div>
              <h3 className="text-xl font-bold text-gray-900">Explore Jobs</h3>
              <p className="text-gray-500 text-sm mt-2">Browse the latest internships and full-time roles tailored for you.</p>
            </Link>

            <Link to="/applications" className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                📝
              </div>
              <h3 className="text-xl font-bold text-gray-900">Track Applications</h3>
              <p className="text-gray-500 text-sm mt-2">Check the status of your submitted applications and waitlist updates.</p>
            </Link>
            
            <Link to="/profile" className="md:col-span-2 bg-blue-600 p-8 rounded-2xl text-white hover:bg-blue-700 transition-all flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Complete your Profile</h3>
                <p className="text-blue-100 text-sm mt-1">Upload your resume and CGPA to increase your visibility to recruiters.</p>
              </div>
              <span className="text-2xl">→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Recruiter Dashboard
  if (user.role === "RECRUITER") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Recruiter Hub</h1>
          <p className="text-gray-500 mb-10">Manage your active listings and find top talent.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <Link to="/post-job" className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-400 transition-all">
              <h3 className="text-xl font-bold text-gray-900">Post a Job</h3>
              <p className="text-gray-500 text-sm mt-2">Create a new listing for internships or full-time positions.</p>
            </Link>
            <Link to="/my-jobs" className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-400 transition-all">
              <h3 className="text-xl font-bold text-gray-900">Manage Listings</h3>
              <p className="text-gray-500 text-sm mt-2">Review applicants, shortlist candidates, or close active jobs.</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if(user.role === "ADMIN"){
    return <Navigate to="/admin" replace/>
  }
  return null;
};

export default Home;