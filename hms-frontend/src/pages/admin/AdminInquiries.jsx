import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaUser, FaClock, FaCheckCircle, FaTrash, FaInfoCircle, FaHotel, FaSearch, FaSignOutAlt, FaUserCircle, FaEye, FaBars, FaHome } from 'react-icons/fa';
import { inquiriesAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/admin/Sidebar';

const AdminInquiries = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const API_BASE_URL = 'https://hotel-management-system-uqxt.onrender.com';

    const getAvatarUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const response = await inquiriesAPI.getAll();
            setInquiries(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch inquiries');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await inquiriesAPI.update(id, { status });
            toast.success(`Inquiry marked as ${status}`);
            fetchInquiries();
            if (selectedInquiry?.id === id) {
                setSelectedInquiry(prev => ({ ...prev, status }));
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
        try {
            await inquiriesAPI.delete(id);
            toast.success('Inquiry deleted successfully');
            fetchInquiries();
            if (selectedInquiry?.id === id) setSelectedInquiry(null);
        } catch (error) {
            toast.error('Failed to delete inquiry');
        }
    };

    const filteredInquiries = inquiries.filter(inq =>
        inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-slate-900">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 lg:ml-80 flex flex-col min-w-0">

                <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                    <div className="px-4 md:px-8 py-4 flex items-center justify-between gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaBars size={24} />
                        </button>
                        <div className="flex items-center gap-4">
                            <Link to="/" className="text-gray-500 hover:text-blue-600 font-bold text-sm flex items-center gap-2">
                                <FaHome size={16} /> Home
                            </Link>
                        </div>

                        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search by name, email or subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-slate-600 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-3 hover:bg-slate-50 rounded-full p-1 pr-3 transition-colors border border-transparent hover:border-slate-100"
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-blue-50 bg-white">
                                        <img
                                            src={getAvatarUrl(user?.avatar_url) || `https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=3b82f6&color=fff`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-left hidden sm:block">
                                        <p className="text-sm font-bold text-slate-800 leading-tight">{user?.username || 'Admin'}</p>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Administrator</p>
                                    </div>
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                                        <div className="px-4 py-2 border-b border-slate-50 mb-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
                                        </div>
                                        <Link
                                            to="/admin/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-bold transition-all"
                                            onClick={() => setShowProfileMenu(false)}
                                        >
                                            <FaUserCircle size={16} />
                                            <span>My Profile</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                navigate('/');
                                                toast.success('Logged out successfully');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 font-bold transition-all text-left"
                                        >
                                            <FaSignOutAlt size={16} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        <div className={`${selectedInquiry ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
                            {filteredInquiries.length === 0 ? (
                                <div className="bg-white border border-slate-200 p-20 rounded-3xl text-center">
                                    <FaEnvelope size={48} className="text-slate-200 mx-auto mb-6" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matching inquiries</p>
                                </div>
                            ) : (
                                filteredInquiries.map((inquiry) => (
                                    <div
                                        key={inquiry.id}
                                        onClick={() => setSelectedInquiry(inquiry)}
                                        className={`p-6 rounded-2xl border transition-all cursor-pointer group ${selectedInquiry?.id === inquiry.id
                                            ? 'bg-blue-50 border-blue-200 shadow-md'
                                            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${inquiry.status === 'replied' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    <FaUser size={18} />
                                                </div>
                                                <div>
                                                    <h4 className="text-slate-800 font-bold tracking-tight">{inquiry.name}</h4>
                                                    <p className="text-slate-400 text-xs font-bold truncate w-40">{inquiry.email}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${inquiry.status === 'replied' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                {inquiry.status}
                                            </span>
                                        </div>
                                        <h5 className="text-slate-700 font-bold text-sm mb-2 line-clamp-1">{inquiry.subject}</h5>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                                                <FaClock size={10} />
                                                {new Date(inquiry.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1 text-blue-600 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                                View <FaEye size={12} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {selectedInquiry && (
                            <div className="lg:col-span-7">
                                <div className="bg-white border border-slate-200 rounded-3xl p-8 sticky top-24 shadow-sm">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest block mb-2">Message Content</span>
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedInquiry.subject}</h3>
                                        </div>
                                        <button onClick={() => setSelectedInquiry(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                            <p className="text-blue-600 font-bold text-[9px] uppercase tracking-widest mb-1 flex items-center gap-2"><FaUser size={10} /> Sender</p>
                                            <p className="text-slate-800 font-bold">{selectedInquiry.name}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                            <p className="text-blue-600 font-bold text-[9px] uppercase tracking-widest mb-1 flex items-center gap-2"><FaEnvelope size={10} /> Address</p>
                                            <p className="text-slate-800 font-bold text-sm truncate">{selectedInquiry.email}</p>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <p className="text-blue-600 font-bold text-[9px] uppercase tracking-widest mb-3 flex items-center gap-2"><FaInfoCircle size={10} /> Message</p>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-600 font-medium leading-relaxed whitespace-pre-wrap text-sm">
                                            {selectedInquiry.message}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6 border-t border-slate-100">
                                        <button
                                            onClick={() => handleUpdateStatus(selectedInquiry.id, 'replied')}
                                            disabled={selectedInquiry.status === 'replied'}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${selectedInquiry.status === 'replied' ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                                        >
                                            <FaCheckCircle /> {selectedInquiry.status === 'replied' ? 'Replied' : 'Mark Replied'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(selectedInquiry.id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                                        >
                                            <FaTrash size={12} /> Delete Inquiry
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminInquiries;
