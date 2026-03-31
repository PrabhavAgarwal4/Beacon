import React from 'react';

function JobCard({ job }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer">
              {job.title}
            </h3>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                job.job_type === 'FULL_TIME'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              {job.job_type.replace('_', ' ')}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {job.description}
          </p>
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
            <span>📍 {job.location}</span>
            <span>💰 {job.stipend_or_ctc || 'Not Disclosed'}</span>
            <span>🎓 Min CGPA: {job.minimum_cgpa}</span>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between h-full gap-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 w-full md:w-auto">
            Apply Now
          </button>
          <p className="text-[11px] text-gray-400">
            Deadline: {new Date(job.application_deadline).toLocaleDateString()}
          </p>
        </div>
      </div>
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
  );
}

export default JobCard;