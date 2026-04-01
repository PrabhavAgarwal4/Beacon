import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  //placeholders for stats
  const stats = [
    { label: 'Active Jobs', value: '4', icon: '💼', color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Applicants', value: '142', icon: '👥', color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Shortlisted', value: '18', icon: '⭐', color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Waitlisted', value: '5', icon: '⏳', color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hiring Overview</h1>
          <p className="text-slate-500">Track your recruitment pipeline and active listings.</p>
        </div>
        <button 
          onClick={() => navigate('/recruiter/post-job')}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
        >
          Create New Posting
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2rem border border-slate-200 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-xl mb-4`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-300px flex flex-col items-center justify-center border-dashed">
            <div className="text-4xl mb-4">📉</div>
            <p className="text-slate-400 font-bold text-center">Applicant Trends Over Time <br/><span className="text-xs font-medium">Chart integration coming soon...</span></p>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6">
          <h3 className="font-bold text-lg">Pro Tips</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="text-blue-400">💡</span>
              <p className="text-xs text-slate-300">Detailed job descriptions get 40% more qualified applicants.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400">💡</span>
              <p className="text-xs text-slate-300">Shortlisting candidates quickly improves your hiring brand.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/recruiter/my-jobs')}
            className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all"
          >
            Manage Current Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;