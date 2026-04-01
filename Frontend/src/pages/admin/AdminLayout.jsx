import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: '📊' },
    { name: 'Pending Users', path: '/admin/users', icon: '👥' },
    { name: 'Pending Jobs', path: '/admin/jobs', icon: '💼' },
    // { name: 'System Logs', path: '/admin/logs', icon: '📜' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-black text-blue-400 tracking-tighter">BEACON ADMIN</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between sticky top-0 z-10">
          <h1 className="font-bold text-slate-800">Admin Control Panel</h1>
          <div className="flex items-center space-x-4">
            <span className="text-xs bg-slate-100 px-2 py-1 rounded border">v1.0.2</span>
          </div>
        </header>
        
        <div className="p-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;