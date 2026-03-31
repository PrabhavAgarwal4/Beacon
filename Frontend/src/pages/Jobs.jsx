import { useEffect, useState } from "react";
import { getAllJobs } from "../services/jobService.js";
import JobCard from "../components/JobCard.jsx"; // Import the new component

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
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

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Available Opportunities</h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            {totalJobs} Jobs Found
          </span>
        </div>

        {/* Filter Bar */}
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
            <div className="grid gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} /> // Clean usage of the Card component
              ))}
            </div>

            {/* Pagination Controls */}
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