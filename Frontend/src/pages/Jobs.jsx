import { useEffect, useState } from "react";
import { getAllJobs } from "../services/jobService.js";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Passing all filter params to your service
      const res = await getAllJobs({ 
        page: currentPage, 
        search, 
        location, 
        job_type: jobType 
      });

      const { jobs, totalJobs, totalPages, page } = res.data.data;
      setJobs(jobs);
      setTotalJobs(totalJobs);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on page change or filter submit
  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 on new search
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Title Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Available Opportunities</h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            {totalJobs} Jobs Found
          </span>
        </div>

        {/* --- NEW: Filter Bar --- */}
        <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-200px">
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Search</label>
            <input 
              type="text" 
              placeholder="Title or Skills..."
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-48">
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Location</label>
            <input 
              type="text" 
              placeholder="City or Remote"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="w-48">
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Job Type</label>
            <select 
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="INTERN">Internship</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors sm:text-sm">
            Filter
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* --- Your Original Card UI --- */}
            <div className="grid gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer">{job.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${job.job_type === 'FULL_TIME' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {job.job_type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
                        <span>📍 {job.location}</span>
                        <span>💰 {job.stipend_or_ctc || "Not Disclosed"}</span>
                        <span>🎓 Min CGPA: {job.minimum_cgpa}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between h-full gap-4">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 w-full md:w-auto">Apply Now</button>
                      <p className="text-[11px] text-gray-400">Deadline: {new Date(job.application_deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                    {job.skills_required.split(',').map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md">{skill.trim()}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* --- NEW: Pagination Section --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-2 border rounded-md bg-white disabled:opacity-50 hover:bg-gray-50 text-sm font-medium"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-md border text-sm font-medium transition-colors ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-2 border rounded-md bg-white disabled:opacity-50 hover:bg-gray-50 text-sm font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Jobs;