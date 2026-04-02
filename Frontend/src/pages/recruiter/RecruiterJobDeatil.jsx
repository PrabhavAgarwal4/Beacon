import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteJob } from '../../services/recruiterService';
import { getJobById } from '../../services/jobService'; 

const RecruiterJobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const res = await getJobById(jobId);
        setJob(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [jobId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you absolutely sure? This will remove the job and all associated applications permanently.")) return;
    
    try {
      await deleteJob(jobId);
      alert("Job deleted successfully.");
      navigate('/recruiter/my-jobs');
    } catch (err) {
      alert("Delete failed. Some applications might be linked to this job.");
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Loading Job Details...</div>;
  if (!job) return <div className="p-20 text-center">Job not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-900 font-bold text-sm">
          ← Back to Postings
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/recruiter/update-job/${jobId}`)}
            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            Edit Posting
          </button>
          <button 
            onClick={handleDelete}
            className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all"
          >
            Delete Job
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black text-slate-900">{job.title}</h1>
              <p className="text-slate-500 font-medium mt-1">{job.location} • {job.job_type}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
              job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {job.status}
            </span>
          </div>
        </div>

        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatBox label="CTC / Stipend" value={job.stipend_or_ctc} />
            <StatBox label="Min CGPA" value={job.minimum_cgpa} />
            <StatBox label="Deadline" value={new Date(job.application_deadline).toLocaleDateString()} />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirements</label>
            <p className="text-slate-700 mt-2 font-semibold">{job.skills_required}</p>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Description</label>
            <p className="text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value }) => (
  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-lg font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

export default RecruiterJobDetail;