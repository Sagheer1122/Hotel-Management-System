import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI, reviewsAPI } from '../services/api';
import {
    FaCalendarCheck,
    FaSuitcase,
    FaCheckCircle,
    FaArrowRight,
    FaSearch,
    FaChevronDown,
    FaThLarge,
    FaUser,
    FaSignOutAlt,
    FaHotel,
    FaHome,
    FaCompass,
    FaGem,
    FaHistory,
    FaConciergeBell,
    FaStar,
    FaEdit,
    FaTrash,
    FaSave,
    FaTimes,
    FaBars
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Profile from './Profile';

import UserSidebar from '../components/UserSidebar';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [editComment, setEditComment] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (user && (user.role === 'admin' || user.role === 1)) {
            navigate('/admin/dashboard');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        if (!user) {
            setTimeout(() => setLoading(false), 1000);
            return;
        }
        try {
            console.log('Fetching data for user:', user.id);
            const [bookingsRes, reviewsRes] = await Promise.all([
                bookingsAPI.getAll({ user_id: user.id }),
                reviewsAPI.getByUser(user.id)
            ]);


            const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
            const reviewsData = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];

            setBookings(bookingsData);
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            setBookings([]);
            toast.error('Failed to load dashboard data. Please try refreshing.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await reviewsAPI.delete(id);
            setReviews(reviews.filter(r => r.id !== id));
            toast.success('Review deleted successfully');
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    const handleEditReview = async (e) => {
        e.preventDefault();
        if (!editingReview) return;

        try {
            await reviewsAPI.update(editingReview.id, { ...editingReview, comment: editComment });
            setReviews(reviews.map(r => r.id === editingReview.id ? { ...r, comment: editComment } : r));
            setEditingReview(null);
            setEditComment('');
            toast.success('Review updated successfully');
        } catch (error) {
            toast.error('Failed to update review');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await bookingsAPI.update(id, { status: newStatus });
            toast.success(`Booking marked as ${newStatus} successfully`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update booking status');
        }
    };

    const stats = {
        total: bookings.length,
        upcoming: bookings.filter(b => {
            const statusStr = typeof b.status === 'number'
                ? ['pending', 'approved', 'cancelled', 'completed'][b.status]
                : (b.status ? String(b.status).toLowerCase() : 'pending');
            return (statusStr === 'pending' || statusStr === 'approved') && new Date(b.start_date) > new Date();
        }).length,
        completed: bookings.filter(b => {
            const statusStr = typeof b.status === 'number'
                ? ['pending', 'approved', 'cancelled', 'completed'][b.status]
                : (b.status ? String(b.status).toLowerCase() : 'pending');
            return statusStr === 'completed';
        }).length
    };

    const filteredBookings = bookings.filter(booking => {
        const roomName = booking.room?.name || '';
        const matchesSearch = roomName.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        if (filter === 'all') return true;

        const status = typeof booking.status === 'number'
            ? ['pending', 'approved', 'cancelled', 'completed'][booking.status]
            : (booking.status ? String(booking.status).toLowerCase() : 'pending');

        if (filter === 'upcoming') return (status === 'pending' || status === 'approved') && new Date(booking.start_date) > new Date();
        if (filter === 'completed') return status === 'completed';
        return true;
    });

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-indigo-50 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing Guest Profile</p>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#F8FAFF] font-sans text-slate-900 overflow-hidden">
            <UserSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 lg:ml-80 flex flex-col min-w-0 min-h-screen relative transition-all duration-300">

                <header className="h-20 md:h-24 bg-white/50 backdrop-blur-xl border-b border-slate-200/50 px-4 md:px-10 lg:px-14 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <FaBars size={20} />
                        </button>

                        <Link to="/" className="hidden md:flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap">
                            <FaHome size={16} /> Home
                        </Link>

                        <div className="flex-1 max-w-xl relative group hidden md:flex items-center gap-4">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                                <input
                                    type="text"
                                    placeholder="Track your itineraries..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-100/50 border-none rounded-[1.25rem] py-4 pl-14 pr-6 text-[13px] font-bold text-slate-600 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 ml-4 md:ml-8">
                        {/* Mobile Search Icon (optional, if desktop search is hidden) */}
                        <button className="md:hidden p-2 text-slate-400 hover:text-indigo-600">
                            <FaSearch size={18} />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                className="flex items-center gap-3 md:gap-4 hover:bg-white p-1.5 md:p-2 pr-2 md:pr-6 rounded-[1.5rem] transition-all border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/40"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-[1.25rem] overflow-hidden shadow-2xl ring-4 ring-indigo-50/50 border-2 border-white">
                                    <img
                                        src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.username}&background=4f46e5&color=fff&bold=true&size=128`}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-[11px] font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{user?.username || 'Guest'}</p>
                                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest opacity-60">Gold Member</p>
                                </div>
                                <FaChevronDown size={8} className="text-slate-300 hidden md:block" />
                            </button>

                            {showUserDropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowUserDropdown(false)} />
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Logged in as</p>
                                            <p className="text-[10px] font-bold text-slate-800 truncate">{user?.email}</p>
                                        </div>
                                        <button onClick={() => { setActiveTab('profile'); setShowUserDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all rounded-xl">
                                            <FaUser size={12} className="opacity-40" /> Profile Overview
                                        </button>
                                        <div className="mx-4 h-[1px] bg-slate-50 my-1" />
                                        <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-3 text-[9px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all rounded-xl">
                                            <FaSignOutAlt size={12} className="opacity-40" /> Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-10 lg:p-14 max-w-[1600px] mx-auto w-full overflow-y-auto no-scrollbar">
                    {activeTab === 'dashboard' ? (
                        <div className="space-y-8 md:space-y-14 animate-in fade-in duration-700">
                            <div className="relative p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-[#0A0C1F] text-white overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/20 to-transparent"></div>
                                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-600/30 rounded-full blur-[80px]"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-indigo-400 font-black text-[9px] uppercase tracking-[0.3em] mb-4">
                                        <FaGem size={12} /> Luxury Experience
                                    </div>
                                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter mb-4 md:mb-5 leading-[1.1] md:leading-[0.9]">
                                        Explore your<br />Private <span className="text-indigo-500 font-black">Escape.</span>
                                    </h1>
                                    <p className="text-slate-400 font-bold text-xs md:text-sm max-w-md leading-relaxed mb-6">
                                        Your hospitality portal is synchronized. Manage your upcoming stays and discover elite retreats.
                                    </p>
                                    <Link to="/rooms" className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-indigo-600 text-white rounded-[18px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all">
                                        View Collections <FaArrowRight size={11} />
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                                {[
                                    { label: 'Total Bookings', value: stats.total, icon: FaHistory, color: 'text-blue-600', bg: 'bg-blue-50' },
                                    { label: 'Next Stays', value: stats.upcoming, icon: FaConciergeBell, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { label: 'Past Stays', value: stats.completed, icon: FaCheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' }
                                ].map((s, idx) => (
                                    <div key={idx} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[40px] border border-slate-200/60 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-3">{s.label}</p>
                                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{s.value}</h3>
                                        </div>
                                        <div className={`w-12 h-12 md:w-16 md:h-16 ${s.bg} ${s.color} rounded-[18px] md:rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <s.icon size={20} className="md:w-7 md:h-7" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6 md:space-y-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-4">
                                        Recent Activity <span className="w-10 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-400">{filteredBookings.length}</span>
                                    </h2>
                                    <div className="flex bg-white p-1.5 rounded-[1.25rem] border border-slate-200 overflow-x-auto no-scrollbar">
                                        {['all', 'upcoming', 'completed'].map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setFilter(f)}
                                                className={`px-4 md:px-6 py-2.5 rounded-[1rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f
                                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                                    : 'text-slate-400 hover:text-slate-600'
                                                    }`}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-10">
                                    {filteredBookings.length === 0 ? (
                                        <div className="col-span-full py-16 md:py-24 bg-white rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
                                            <FaCalendarCheck size={32} className="md:w-10 md:h-10 text-slate-100 mx-auto mb-4 md:mb-6" />
                                            <p className="text-slate-400 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em]">Archive is empty</p>
                                        </div>
                                    ) : (
                                        filteredBookings.slice(0, 6).map((booking) => (
                                            <div key={booking.id} className="group bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-indigo-600/5 transition-all duration-700">
                                                <div className="relative h-48 md:h-56 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-6 md:mb-8">
                                                    <img
                                                        src={booking.room?.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                        alt=""
                                                    />
                                                    <div className="absolute top-4 right-4">
                                                        <span className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-xl ${booking.status === 'approved' || booking.status === 1 ? 'bg-emerald-500 text-white' :
                                                            booking.status === 'pending' || booking.status === 0 ? 'bg-amber-400 text-white' : 'bg-slate-900 text-white'
                                                            }`}>
                                                            {typeof booking.status === 'number' ? ['pending', 'approved', 'cancelled', 'completed'][booking.status] : booking.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="px-2">
                                                    <h4 className="text-lg md:text-xl font-black text-slate-900 tracking-tight mb-2 truncate uppercase">{booking.room?.name}</h4>
                                                    <div className="flex items-center gap-3 text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-6 md:mb-8 pb-6 md:pb-8 border-b border-slate-50">
                                                        {new Date(booking.start_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                        <FaArrowRight size={8} className="text-indigo-300" />
                                                        {new Date(booking.end_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span className="text-base md:text-lg font-black text-slate-900 tracking-tight">Rs.{booking.total_price.toLocaleString()}</span>
                                                        <div className="flex items-center gap-2">
                                                            {(typeof booking.status === 'number' ? booking.status === 1 : (String(booking.status).toLowerCase() === 'approved')) && (
                                                                <button
                                                                    onClick={(e) => { e.preventDefault(); handleStatusUpdate(booking.id, 'completed'); }}
                                                                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                                                                >
                                                                    Complete
                                                                </button>
                                                            )}
                                                            <Link to={`/rooms/${booking.room_id}`} className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-inner">
                                                                <FaArrowRight size={12} className="md:w-[14px] md:h-[14px]" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'bookings' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <div className="flex items-center justify-between mb-8 md:mb-16">
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Stay Archives</h1>
                                    <p className="text-[10px] md:text-xs font-black text-slate-400 mt-2 uppercase tracking-widest leading-none">Management of your hospitality history</p>
                                </div>
                                <div>
                                    <Link to="/rooms" className="w-full md:w-auto group flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                                        + New Booking
                                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-200/60 shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                                <table className="w-full text-left min-w-[800px] whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-[#0A0C1F] text-[9px] font-black text-white/30 uppercase tracking-[0.3em] border-b border-white/5">
                                            <th className="px-6 py-5 md:px-10 md:py-7">Guest Accommodation</th>
                                            <th className="px-6 py-5 md:px-10 md:py-7">Period</th>
                                            <th className="px-6 py-5 md:px-10 md:py-7 text-center">Status</th>
                                            <th className="px-6 py-5 md:px-10 md:py-7 text-center">Investment</th>
                                            <th className="px-6 py-5 md:px-10 md:py-7 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {bookings.map(b => (
                                            <tr key={b.id} className="hover:bg-indigo-50/20 transition-all">
                                                <td className="px-6 py-5 md:px-10 md:py-7">
                                                    <span className="font-black text-slate-900 text-[11px] md:text-[13px] uppercase tracking-tight">{b.room?.name}</span>
                                                    <p className="text-[8px] md:text-[9px] font-black text-indigo-500/60 uppercase tracking-widest mt-1.5">{b.room?.category || 'Luxury Suite'}</p>
                                                </td>
                                                <td className="px-6 py-5 md:px-10 md:py-7 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                                                    {new Date(b.start_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} — {new Date(b.end_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-5 md:px-10 md:py-7 text-center">
                                                    <span className={`px-3 py-1.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${(typeof b.status === 'number' ? b.status === 1 : b.status === 'approved') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        (typeof b.status === 'number' ? b.status === 0 : b.status === 'pending') ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                            (typeof b.status === 'number' ? b.status === 3 : b.status === 'completed') ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                                'bg-rose-50 text-rose-600 border-rose-100'
                                                        }`}>
                                                        {typeof b.status === 'number' ? ['pending', 'approved', 'cancelled', 'completed'][b.status] : b.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 md:px-10 md:py-7 text-center text-xs md:text-sm font-black text-slate-900">
                                                    Rs.{b.total_price.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-5 md:px-10 md:py-7 text-right flex items-center justify-end gap-2">
                                                    {(typeof b.status === 'number' ? b.status === 1 : (String(b.status).toLowerCase() === 'approved')) && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(b.id, 'completed')}
                                                            className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-emerald-600 border border-emerald-600 text-white rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                    <Link to={`/rooms/${b.room_id}`} className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white border border-slate-200 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all">
                                                        Check it out
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeTab === 'reviews' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-4xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">My Reviews</h1>
                                    <p className="text-[10px] md:text-xs font-black text-slate-400 mt-2 uppercase tracking-widest leading-none">Your feedback history</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {reviews.length === 0 ? (
                                    <div className="py-24 bg-white rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center">
                                        <FaStar size={32} className="md:w-10 md:h-10 mx-auto text-slate-200 mb-6" />
                                        <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]">No reviews yet</p>
                                    </div>
                                ) : (
                                    reviews.map(review => (
                                        <div key={review.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight mb-1">{review.room?.name || 'Room Name'}</h3>
                                                        <div className="flex text-amber-400 gap-1 mb-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-slate-100'} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 rounded-xl text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {editingReview?.id === review.id ? (
                                                    <form onSubmit={handleEditReview} className="mt-4 bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200">
                                                        <textarea
                                                            value={editComment}
                                                            onChange={(e) => setEditComment(e.target.value)}
                                                            className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300"
                                                            rows="3"
                                                            placeholder="Update your review..."
                                                        />
                                                        <div className="flex gap-3 mt-4 justify-end">
                                                            <button type="button" onClick={() => setEditingReview(null)} className="px-4 py-2 md:px-6 md:py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-2">
                                                                <FaTimes /> Cancel
                                                            </button>
                                                            <button type="submit" className="px-4 py-2 md:px-6 md:py-3 bg-indigo-600 text-white rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2">
                                                                <FaSave /> Save Update
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <p className="text-slate-500 text-sm font-medium leading-relaxed bg-slate-50/50 p-4 md:p-6 rounded-2xl border border-slate-100/50 italic">"{review.comment}"</p>
                                                )}
                                            </div>

                                            <div className="flex flex-row md:flex-col gap-3 justify-end md:justify-start border-t md:border-t-0 md:border-l border-slate-50 pt-6 md:pt-0 md:pl-6 md:w-auto w-full">
                                                <button
                                                    onClick={() => { setEditingReview(review); setEditComment(review.comment); }}
                                                    className="p-3 md:p-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all group/btn flex-1 md:flex-none flex justify-center"
                                                    title="Edit Review"
                                                >
                                                    <FaEdit size={16} className="group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    className="p-3 md:p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all group/btn flex-1 md:flex-none flex justify-center"
                                                    title="Delete Review"
                                                >
                                                    <FaTrash size={16} className="group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'profile' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-5xl mx-auto">
                            <Profile />
                        </div>
                    ) : null}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
