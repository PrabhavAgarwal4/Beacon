import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../services/recruiterService';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    job_type: 'FULL_TIME', // Default value matching your enum
    location: '',
    stipend_or_ctc: '',
    minimum_cgpa: '',
    skills_required: '',
    application_deadline: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createJob(formData);
      alert("Job posted! Waiting for Admin approval.");
      navigate('/recruiter/my-jobs');
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Create New Opportunity</h1>
        <p className="text-slate-500">Provide clear details to attract the best matching talent.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
        
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Title</label>
            <input 
              type="text" name="title" required value={formData.title} onChange={handleChange}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
            <input 
              type="text" name="location" required value={formData.location} onChange={handleChange}
              placeholder="e.g. Remote or Bangalore, India"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detailed Description</label>
          <textarea 
            name="description" required rows="5" value={formData.description} onChange={handleChange}
            placeholder="Describe the role, responsibilities, and day-to-day tasks..."
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Specifics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Type</label>
            <select 
              name="job_type" value={formData.job_type} onChange={handleChange}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stipend / CTC</label>
            <input 
              type="text" name="stipend_or_ctc" required value={formData.stipend_or_ctc} onChange={handleChange}
              placeholder="e.g. 12 LPA or 25k/mo"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min CGPA</label>
            <input 
              type="number" step="0.1" name="minimum_cgpa" required value={formData.minimum_cgpa} onChange={handleChange}
              placeholder="7.5"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Skills & Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required Skills</label>
            <input 
              type="text" name="skills_required" required value={formData.skills_required} onChange={handleChange}
              placeholder="React, Node.js, SQL (comma separated)"
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Application Deadline</label>
            <input 
              type="date" name="application_deadline" required value={formData.application_deadline} onChange={handleChange}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-6 flex gap-4">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all disabled:bg-slate-300"
          >
            {loading ? "Processing..." : "Submit for Approval"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;