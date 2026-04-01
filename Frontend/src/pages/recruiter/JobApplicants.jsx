import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { allApplicantsForJob, updateAppStatus } from "../../services/recruiterService";

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const res = await allApplicantsForJob(jobId);
      setApplicants(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    // 1. Professional Confirmation Pop-up
    const confirmMessage = newStatus === "REJECTED" 
      ? "Are you sure you want to reject this applicant? This action is usually final."
      : `Move applicant to ${newStatus}?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      // 2. DB Update
      await updateAppStatus(appId, { status: newStatus });

      // 3. Instant Frontend State Update
      // Note: We use 'app.id' here because that's what your backend response uses
      setApplicants((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
      
      alert(`Status updated to ${newStatus}`);
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse text-blue-600 font-black">
        SCOUTING TALENT...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-2rem border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {applicants[0]?.job_title || "Application"} Queue
          </h2>
          <p className="text-xs text-slate-500">Reviewing candidates for this position.</p>
        </div>
        <span className="bg-blue-50 px-4 py-2 rounded-full text-xs font-bold text-blue-600">
          {applicants.length} Total Applicants
        </span>
      </div>

      {/* List Section */}
      <div className="grid gap-4">
        {applicants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2rem border border-dashed border-slate-200">
            <p className="text-slate-400 italic">No applicants found for this role yet.</p>
          </div>
        ) : (
          applicants.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition-all gap-4"
            >
              {/* Student Identity */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black">
                  {app.name?.charAt(0) || "S"}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{app.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Status: {app.status}
                  </p>
                </div>
              </div>

              {/* Status Badge (Visual Indicator) */}
              <div
                className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                  app.status === "SHORTLISTED" ? "bg-green-100 text-green-600" : 
                  app.status === "REJECTED" ? "bg-red-100 text-red-600" : 
                  app.status === "INTERVIEWING" ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-500"
                }`}
              >
                {app.status}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(`/recruiter/student-profile/${app.student_user_id}`)}
                  className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                >
                  Review Profile
                </button>

                <div className="h-8 w-px bg-slate-100 mx-2"></div>

                <div className="flex gap-2 items-center">
                  {app.status !== "REJECTED" && (
                    <button
                      onClick={() => handleStatusUpdate(app.id, "REJECTED")}
                      className="px-4 py-2 text-[10px] font-black text-red-400 hover:text-red-600 transition-all uppercase tracking-widest"
                    >
                      Reject
                    </button>
                  )}

                  <select
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl outline-none cursor-pointer transition-all ${
                      app.status === "SHORTLISTED" ? "bg-green-600 text-white" : 
                      app.status === "INTERVIEWING" ? "bg-purple-600 text-white" : 
                      app.status === "ACCEPTED" ? "bg-blue-600 text-white" : "bg-slate-900 text-white"
                    }`}
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="SHORTLISTED">Shortlist</option>
                    <option value="INTERVIEWING">Interview</option>
                    <option value="ACCEPTED">Hire</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobApplicants;