import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext.jsx';
import { getRecruiterDetails, setRecruiterDetails } from '../../services/recruiterService.js';

const RecruiterProfile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    company_website: '',
    company_description: '',
    designation: '',
    phone: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Using user.id as targetId from AuthContext
        const res = await getRecruiterDetails(user.id);
        if (res.data.data) {
          setFormData(res.data.data);
          setProfileExists(true);
        }
      } catch (err) {
        console.log("Profile not initialized yet.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await setRecruiterDetails(formData);
      setProfileExists(true);
      alert("Company profile saved successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black">
          {formData.company_name ? formData.company_name.charAt(0) : user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Company Profile</h1>
          <p className="text-slate-500 text-sm">This information will be visible to all job seekers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Preview Card */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white sticky top-24">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6">Live Preview</p>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{formData.company_name || "Company Name"}</h2>
              <p className="text-blue-400 text-sm font-medium">{formData.company_website || "website.com"}</p>
              <hr className="border-slate-800" />
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Hiring Lead</p>
                <p className="text-sm">{user.name}</p>
                <p className="text-xs text-slate-400">{formData.designation || "Designation"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Settings Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Name</label>
                <input 
                  type="text" name="company_name" required value={formData.company_name} onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Website</label>
                <input 
                  type="url" name="company_website" required value={formData.company_website} onChange={handleChange}
                  placeholder="https://..."
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Designation</label>
                <input 
                  type="text" name="designation" required value={formData.designation} onChange={handleChange}
                  placeholder="e.g. HR Manager"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Phone</label>
                <input 
                  type="text" name="phone" required value={formData.phone} onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Description</label>
              <textarea 
                name="company_description" required rows="4" value={formData.company_description} onChange={handleChange}
                placeholder="Tell students about your company culture and mission..."
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={updating}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all disabled:bg-slate-300"
            >
              {updating ? "Saving..." : profileExists ? "Update Company Profile" : "Create Company Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;