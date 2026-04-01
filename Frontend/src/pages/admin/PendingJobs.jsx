import React, { useEffect, useState } from 'react';
import { getPendingJobs, approveJob } from '../../services/adminService';

const PendingJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getPendingJobs();
      setJobs(res.data.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleApprove = async (id) => {
    try {
      await approveJob(id);
      setJobs(jobs.filter(j => j.id !== id));
      setSelectedJob(null);
    } catch (err) { alert("Approval failed."); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Job Moderation Queue</h2>
          <p className="text-xs text-slate-500 mt-1">Carefully review all fields before allowing the post to go live.</p>
        </div>
        <div className="text-right">
            <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
               {jobs.length} Awaiting Review
            </span>
        </div>
      </div>

      {/* Jobs List */}
      <div className="grid gap-4">
        {jobs.length === 0 ? (
            <div className="p-20 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                No pending job postings found.
            </div>
        ) : (
            jobs.map(job => (
                <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center hover:border-blue-400 transition-all">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <div className="flex gap-3 text-xs text-slate-500 mt-1 font-medium">
                        <span>📍 {job.location}</span>
                        <span>💰 {job.stipend_or_ctc}</span>
                        <span className="text-blue-600 uppercase">● {job.job_type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <button onClick={() => setSelectedJob(job)} className="px-5 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
                        Full Review
                    </button>
                    <button onClick={() => handleApprove(job.id)} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">
                        Approve
                    </button>
                  </div>
                </div>
              ))
        )}
      </div>

      {/* --- FULL DETAILS MODAL --- */}
      {selectedJob && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2rem shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Post Verification</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Job ID: #{selectedJob.id}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-400">&times;</button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-8">
              
              {/* Core Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Position Title</label>
                    <p className="text-xl font-bold text-slate-800">{selectedJob.title}</p>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Location & Type</label>
                    <p className="text-lg font-semibold text-slate-700">{selectedJob.location} • <span className="capitalize">{selectedJob.job_type.toLowerCase()}</span></p>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Financials & Eligibility */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Package (CTC)</label>
                    <p className="text-md font-bold text-slate-900 mt-1">{selectedJob.stipend_or_ctc}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Min CGPA</label>
                    <p className="text-md font-bold text-blue-600 mt-1">{selectedJob.minimum_cgpa}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <label className="text-[10px] font-black text-red-400 uppercase">Deadline</label>
                    <p className="text-md font-bold text-red-600 mt-1">{new Date(selectedJob.application_deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required Skills</label>
                <div className="flex flex-wrap gap-2">
                    {selectedJob.skills_required.split(',').map((skill, i) => (
                        <span key={i} className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 italic">#{skill.trim()}</span>
                    ))}
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detailed Description</label>
                <div className="bg-slate-50 p-6 rounded-2xl text-sm text-slate-700 leading-relaxed whitespace-pre-line border border-slate-100">
                    {selectedJob.description}
                </div>
              </div>

              {/* Meta Data */}
              <div className="flex justify-between items-center py-4 px-6 bg-slate-900 rounded-2xl text-white">
                <div className="text-[10px] font-medium opacity-70">
                    Posted By Recruiter ID: <span className="font-bold">#{selectedJob.recruiter_id}</span>
                </div>
                <div className="text-[10px] font-medium opacity-70">
                    Created At: {new Date(selectedJob.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/50">
              <button onClick={() => setSelectedJob(null)} className="px-6 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase">Reject / Cancel</button>
              <button 
                onClick={() => handleApprove(selectedJob.id)}
                className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Approve & Push Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingJobs;