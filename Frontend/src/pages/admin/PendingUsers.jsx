import React, { useEffect, useState } from 'react';
import { getPendingUsers, approveUser } from '../../services/adminService';

const PendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await getPendingUsers();
      setUsers(res.data.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try {
      await approveUser(id);
      setUsers(users.filter(u => u.id !== id));
      setSelectedUser(null);
    } catch (err) { alert("Action Failed"); }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-slate-400">Loading verification queue...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Identity Verification</h3>
          <p className="text-xs text-slate-500">Review and approve new platform members</p>
        </div>
        <span className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full uppercase">
          {users.length} Pending
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
            <tr>
              <th className="px-6 py-4">Full Name & Email</th>
              <th className="px-6 py-4">Account Type</th>
              <th className="px-6 py-4">Profile Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{u.name}</div>
                  <div className="text-xs text-slate-500">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${
                    u.role === 'RECRUITER' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold ${u.rollno || u.company_name ? 'text-green-600' : 'text-slate-400'}`}>
                    {u.rollno || u.company_name ? "● Details Provided" : "○ Empty Profile"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  <button onClick={() => setSelectedUser(u)} className="text-slate-400 font-bold hover:text-blue-600 transition-colors">Review</button>
                  <button onClick={() => handleApprove(u.id)} className="bg-slate-900 text-white text-[10px] px-4 py-2 rounded-lg font-black hover:bg-green-600 transition-all uppercase">Verify</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- UNIFIED PREVIEW MODAL --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Identity Preview</span>
              <button onClick={() => setSelectedUser(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400">&times;</button>
            </div>
            
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Common Header */}
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${selectedUser.role === 'RECRUITER' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 leading-none">{selectedUser.name}</h4>
                  <p className="text-slate-500 font-medium mt-1">{selectedUser.email}</p>
                </div>
              </div>

              {/* ROLE SPECIFIC DETAILS */}
              {selectedUser.role === 'STUDENT' ? (
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <DetailBox label="Roll Number" value={selectedUser.rollno} />
                      <DetailBox label="CGPA" value={selectedUser.cgpa} color="text-blue-600" />
                      <DetailBox label="Department" value={selectedUser.department} />
                      <DetailBox label="Grad Year" value={selectedUser.graduation_year} />
                   </div>
                   {selectedUser.resume_url && (
                      <a href={selectedUser.resume_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-blue-600 transition-all">
                        📄 Download Student Resume
                      </a>
                   )}
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="p-5 bg-purple-50 border border-purple-100 rounded-2xl">
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Company</p>
                      <p className="text-lg font-black text-purple-900">{selectedUser.company_name || 'Not Provided'}</p>
                      <a href={selectedUser.company_website} target="_blank" rel="noreferrer" className="text-xs text-purple-600 underline font-bold">{selectedUser.company_website}</a>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <DetailBox label="Designation" value={selectedUser.designation} />
                      <DetailBox label="Contact" value={selectedUser.recruiter_phone} />
                   </div>
                   <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About Company</p>
                      <p className="text-sm text-slate-600 mt-2 italic leading-relaxed">{selectedUser.company_description || 'No description provided.'}</p>
                   </div>
                </div>
              )}

              {/* If profile isn't filled */}
              {!(selectedUser.rollno || selectedUser.company_name) && (
                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
                   <p className="text-xs text-red-600 font-bold">User has not completed their profile details yet.</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setSelectedUser(null)} className="px-6 py-2 text-xs font-black text-slate-400 uppercase">Cancel</button>
              <button 
                onClick={() => handleApprove(selectedUser.id)}
                className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
              >
                Approve {selectedUser.role}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component for UI consistency
const DetailBox = ({ label, value, color = "text-slate-700" }) => (
  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className={`font-black mt-1 ${color}`}>{value || 'N/A'}</p>
  </div>
);

export default PendingUsers;