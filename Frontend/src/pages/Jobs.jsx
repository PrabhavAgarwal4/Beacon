import { useEffect, useState } from "react";
import { getAllJobs } from "../services/jobService.js";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs();
   
        setJobs(res.data.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Opportunities</h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {jobs.length} Jobs Found
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-xl">No jobs found at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id} // Fixed: changed _id to id
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer">
                        {job.title}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        job.job_type === 'FULL_TIME' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {job.job_type.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-700">📍 {job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-700">💰 {job.stipend_or_ctc || "Not Disclosed"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-700">🎓 Min CGPA: {job.minimum_cgpa}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between h-full gap-4">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full md:w-auto">
                      Apply Now
                    </button>
                    <p className="text-[11px] text-gray-400">
                      Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                  {job.skills_required.split(',').map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;