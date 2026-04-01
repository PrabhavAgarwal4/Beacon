import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const RecruiterLayout = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/recruiter', icon: '📊' },
    { name: 'My Postings', path: '/recruiter/my-jobs', icon: '💼' },
    { name: 'Post a Job', path: '/recruiter/post-job', icon: '➕' },
    { name: 'Company Profile', path: '/recruiter/profile', icon: '🏢' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">BEACON</Link>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Recruiter Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all font-bold text-sm ${
                location.pathname === item.path 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
           <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase">Hiring Status</p>
              <p className="text-xs font-bold text-green-600 mt-1">Active & Verified</p>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Recruiter Console</h2>
        </header>
        
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet /> {/* This is where sub-pages will render */}
        </div>
      </main>
    </div>
  );
};

export default RecruiterLayout;