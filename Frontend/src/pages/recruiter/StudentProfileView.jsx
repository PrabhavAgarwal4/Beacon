import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentProfile } from '../../services/studentService'; // Reuse your existing service

const StudentProfileView = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await getStudentProfile(studentId);
        console.log(res.data.data)
        setStudent(res.data.data);
      } catch (err) {
        console.error("Error fetching student profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [studentId]);

  if (loading) return <div className="p-20 text-center animate-pulse font-black text-slate-400 uppercase tracking-widest">Retrieving Profile...</div>;

  if (!student) return <div className="text-center py-20 text-red-500 font-bold">Profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="text-slate-400 hover:text-slate-900 font-bold text-sm flex items-center gap-2 transition-colors"
        >
          ← Back to Applicants
        </button>
        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Verified Student</span>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-2xl shadow-blue-100">
          {student.name.charAt(0)}
        </div>
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{student.name}</h1>
          <p className="text-slate-500 font-medium">{student.email} • {student.phone}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
             <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">{student.course}</span>
             <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">{student.department}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Academic Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6">
             <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Current CGPA</p>
                <p className="text-4xl font-black">{student.cgpa}</p>
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Graduation Year</p>
                <p className="text-xl font-bold">{student.graduation_year}</p>
             </div>
             <hr className="border-slate-800" />
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Roll Number</p>
                <p className="text-md font-medium text-slate-300">{student.rollno}</p>
             </div>
          </div>
        </div>

        {/* Resume & Documents */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Professional Resume</h3>
              <p className="text-slate-500 text-sm mb-8">Review the student's official documentation and projects.</p>
            </div>

            {student.resume_url ? (
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">📄</span>
                    <div>
                        <p className="font-bold text-slate-900">Resume_Final.pdf</p>
                        <p className="text-xs text-slate-400 italic">Verified PDF Document</p>
                    </div>
                  </div>
                  <a 
                    href={student.resume_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    View File
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-10 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                <p className="text-slate-400 italic">No resume has been uploaded by this student.</p>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Accuracy</p>
                    <p className="text-sm font-bold text-green-600">100% Verified</p>
                </div>
                <div className="w-px h-8 bg-slate-100"></div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
                    <p className="text-sm font-bold text-slate-900">Active Applicant</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;