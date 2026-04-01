import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyPostedJobs, toggleJobStatus } from '../../services/recruiterService';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getMyPostedJobs();
      setJobs(res.data.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggle = async (id, currentStatus) => {
    try {
      await toggleJobStatus(id);
      // Optimistically update the UI status
      setJobs(jobs.map(j => 
        j.id === id ? { ...j, status: currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN' } : j
      ));
    } catch (err) {
      alert("Failed to change job status.");
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Postings</h2>
          <p className="text-slate-500 text-sm">Manage visibility and track candidate volume.</p>
        </div>
        <button 
          onClick={() => navigate('/recruiter/post-job')}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all"
        >
          + New Listing
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
            <p className="text-slate-400 font-bold italic">No jobs found in your history.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-2rem border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center group hover:border-blue-500 transition-all">
              
              {/* Job Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {job.status}
                  </span>
                  {!job.is_active && (
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      Admin Pending
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                   <span className="flex items-center gap-1">📍 {job.location}</span>
                   <span className="flex items-center gap-1">📅 Posted {new Date(job.created_at).toLocaleDateString()}</span>
                   <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                      👥 {job.applicant_count || 0} Applicants
                   </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6 lg:mt-0">
                <button 
                  onClick={() => handleToggle(job.id, job.status)}
                  className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all ${
                    job.status === 'OPEN' 
                    ? 'border-red-100 text-red-500 hover:bg-red-50' 
                    : 'border-green-100 text-green-600 hover:bg-green-50'
                  }`}
                >
                  {job.status === 'OPEN' ? 'Stop Apps' : 'Re-Open'}
                </button>
                
                <Link 
                  to={`/recruiter/job-applicants/${job.id}`}
                  className="bg-slate-100 text-slate-800 px-6 py-2 rounded-xl font-bold text-xs hover:bg-slate-900 hover:text-white transition-all border border-slate-200"
                >
                  Review Talent
                </Link>
                
                <button 
                  onClick={() => navigate(`/recruiter/update-job/${job.id}`)}
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  title="Edit Posting"
                >
                  ✏️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyJobs;