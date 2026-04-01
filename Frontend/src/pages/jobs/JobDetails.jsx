import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById } from "../../services/jobService.js";
import { applyForJob, getApplicationStatus } from '../../services/applicationService.js';
import { AuthContext } from "../../context/authContext.jsx";

const JobDetails = () => {
  const { jobId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null); 
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        // Fetch Job details
        const jobRes = await getJobById({ jobId });
        setJob(jobRes.data.data);

        // Fetch Application Status separately so it doesn't crash the job fetch
        try {
          const appRes = await getApplicationStatus({ jobId });
          // Only set if the backend returns actual application data
          setApplication(appRes.data.data); 
        } catch (appErr) {
          // If 404 or 400, it just means they haven't applied yet. 
          // We stay silent and keep application as null.
          console.log("User has not applied to this job yet.");
          setApplication(null);
        }

      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [jobId]);

  const handleApply = async () => {
    try {
      setApplying(true);
      const res = await applyForJob({ jobId });
      // Update local state with the application object returned from backend
      setApplication(res.data.data); 
    } catch (error) {
      console.error("Application failed:", error);
    } finally {
      setApplying(false);
    }
  };

  // Helper for Button Text
  const getStatusDisplay = () => {
    if (applying) return "Applying...";
    if (application) return `Application ${application.status}`;
    return "Apply Now";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-2xl font-bold text-gray-800">Job Not Found</h1>
        <p className="text-gray-500 mt-2">The position you are looking for might have been closed or removed.</p>
        <button 
          onClick={() => navigate("/job")}
          className="mt-6 text-blue-600 font-semibold hover:underline"
        >
          ← Back to All Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          <span className="mr-2">←</span> Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Job Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                    {job.title}
                  </h1>
                  <p className="text-blue-600 font-semibold text-lg mt-1">
                    {job.location} • {job.job_type.replace('_', ' ')}
                  </p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {job.status}
                </span>
              </div>

              <div className="prose prose-blue max-w-none">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-[18px]">Job Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-[15px]">
                  {job.description}
                </p>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-[18px]">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.split(',').map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Action & Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="space-y-6">
                <div className="text-center">
                  <button 
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg 
                      ${!application 
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200" 
                        : "bg-gray-100 text-gray-500 border border-gray-200 cursor-default"
                      }`}
                    onClick={handleApply} 
                    disabled={applying || !!application}
                  >
                    {getStatusDisplay()}
                  </button>
                  
                  {application && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="text-xs text-green-700 font-medium">
                        ✓ Your application is currently <span className="font-bold underline">{application.status}</span>
                      </p>
                    </div>
                  )}
                </div>

                <hr className="border-gray-100" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Package</span>
                    <span className="font-bold text-gray-900">{job.stipend_or_ctc}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Min CGPA</span>
                    <span className="font-bold text-gray-900">{job.minimum_cgpa}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Deadline</span>
                    <span className="font-bold text-red-600">
                      {new Date(job.application_deadline).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Posted on</span>
                    <span className="text-gray-900">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="text-blue-800 font-bold mb-2 text-sm">Safety Tip</h4>
              <p className="text-blue-700 text-xs leading-normal">
                Never pay any money to recruiters for job interviews. Beacon verifies all postings, but always stay vigilant.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetails;