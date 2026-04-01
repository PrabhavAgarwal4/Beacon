import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext.jsx';
import { getStudentProfile, setStudentProfile, uploadResume } from '../../services/studentService.js';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    rollno: '',
    department: '',
    course: '',
    graduation_year: '',
    cgpa: '',
    phone: ''
  });
  
  const [profileExists, setProfileExists] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");

useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getStudentProfile(user.id);
        // If data exists, populate the form
        if (res.data.data) {
          const profile = res.data.data;
          setFormData({
            rollno: profile.rollno || '',
            department: profile.department || '',
            course: profile.course || '',
            graduation_year: profile.graduation_year || '',
            cgpa: profile.cgpa || '',
            phone: profile.phone || ''
          });
          setResumeUrl(profile.resume_url);
          setProfileExists(true); // This turns the button to "Update Profile"
        }
      } catch (err) {
        // If 404, student hasn't created a profile yet
        setProfileExists(false); 
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // This call now works for both New and Existing profiles
      const res = await setStudentProfile(formData);
      setProfileExists(true);
      alert(profileExists ? "Profile updated!" : "Profile created!");
      alert("Profile sent for Admin approval. You will be notified once verified.");
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("resume", file);

    try {
      setUpdating(true);
      const res = await uploadResume(data);
      setResumeUrl(res.data.data.resume_url);
      alert("Resume uploaded successfully!");
    } catch (err) {
      alert("Resume upload failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: User Identity Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <div className="mt-4 inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase">
              {user.role}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Your Resume</h3>
            {resumeUrl ? (
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="block w-full text-center py-2 px-4 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition">
                📄 View Current Resume
              </a>
            ) : (
              <p className="text-xs text-gray-400 italic">No resume uploaded yet.</p>
            )}
            <label className="mt-4 block w-full text-center py-2 px-4 bg-gray-900 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-800 transition">
              {resumeUrl ? "Update Resume" : "Upload Resume"}
              <input type="file" className="hidden" onChange={handleResumeUpload} accept=".pdf,.doc,.docx" />
            </label>
          </div>
        </div>

        {/* Right: Academic Details Form */}
        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Academic Details</h3>
            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                <input type="number" name="rollno" value={formData.rollno} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" required />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleInputChange} placeholder="e.g. CSE" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" required />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <input type="text" name="course" value={formData.course} onChange={handleInputChange} placeholder="e.g. B.Tech" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" required />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                <input type="number" name="graduation_year" value={formData.graduation_year} onChange={handleInputChange} placeholder="2026" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" required />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Current CGPA</label>
                <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleInputChange} placeholder="9.5" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" required />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91..." className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" required />
              </div>

              <div className="sm:col-span-2 mt-4">
                <button type="submit" disabled={updating} className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg ${updating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"}`}>
                  {updating ? "Saving..." : profileExists ? "Update Profile" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;