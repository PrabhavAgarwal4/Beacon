import { useEffect, useState } from "react";
import { getMyApplications } from "../../services/applicationService.js";
import { Link } from "react-router-dom";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await getMyApplications();
        setApplications(res.data.data);
        console.log(res.data.data)
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACCEPTED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200'; // PENDING
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 mt-2">Track the status of your current job applications.</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg font-medium">You haven't applied to any jobs yet.</p>
            <Link to="/jobs" className="text-blue-600 hover:underline mt-2 inline-block font-semibold">
              Browse jobs →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div 
                key={app.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center hover:border-blue-300 transition-all"
              >
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {app.title || `Job ID: ${app.job_id}`}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex gap-4">
                    <span>📍 {app.location || "Remote"}</span>
                    <span>🕒 Applied on {new Date(app.applied_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <Link 
                    to={`/job/${app.job_id}`}
                    className="text-blue-600 font-semibold hover:text-blue-700 text-sm px-4 py-2 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;