import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminOverview = () => {
  const navigate = useNavigate();

  // Mock stats - in the future, you'll fetch these from a /admin/stats endpoint
  const stats = [
    { label: 'Total Users', value: '1,240', icon: '👥', color: 'bg-blue-500' },
    { label: 'Pending Approvals', value: '12', icon: '⏳', color: 'bg-orange-500' },
    { label: 'Active Jobs', value: '84', icon: '💼', color: 'bg-green-500' },
    { label: 'System Health', value: '99.9%', icon: '⚡', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>
        <p className="text-slate-500">Welcome back. Here is what's happening across Beacon today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl text-white ${stat.color} shadow-lg`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                +4% Today
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Actions Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Critical Actions
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="font-bold text-slate-800">Verify New Users</p>
                  <p className="text-xs text-slate-500">12 identities waiting for review</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/admin/users')}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 underline"
              >
                Review All
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-2xl">🏢</span>
                <div>
                  <p className="font-bold text-slate-800">Job Moderation</p>
                  <p className="text-xs text-slate-500">6 new postings require verification</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/admin/jobs')}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 underline"
              >
                Review All
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Placeholder */}
        <div className="bg-slate-900 rounded-2xl p-8 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-white font-bold text-lg">Growth Analytics</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs">
                Real-time chart integration with Chart.js is coming in the next update.
            </p>
            <div className="mt-6 flex gap-2">
                <div className="w-1 bg-blue-500 h-8 rounded-full animate-pulse"></div>
                <div className="w-1 bg-blue-400 h-12 rounded-full animate-pulse delay-75"></div>
                <div className="w-1 bg-blue-600 h-10 rounded-full animate-pulse delay-150"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;