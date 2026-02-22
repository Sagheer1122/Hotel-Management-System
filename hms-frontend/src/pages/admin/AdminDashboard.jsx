import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI, roomsAPI, bookingsAPI, API_BASE_URL } from '../../services/api';
import {
    FaUsers,
    FaHotel,
    FaCalendarCheck,
    FaChartLine,
    FaBell,
    FaSearch,
    FaSignOutAlt,
    FaHome,
    FaBed,
    FaCalendarAlt,
    FaUserCircle,
    FaEdit,
    FaKey,
    FaBan,
    FaArrowRight,
    FaLongArrowAltRight,
    FaBars
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const StatCard = ({ icon: Icon, label, value, bgColor }) => (
    <div className={`${bgColor} rounded-3xl p-6 md:p-8 text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group`}>
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>

        <div className="flex flex-col gap-6 relative z-10">
            <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner">
                <Icon size={28} />
            </div>
            <div>
                <h3 className="text-2xl font-black tracking-tight leading-none mb-1.5">{value}</h3>
                <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.2em]">{label}</p>
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');

    const getAvatarUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRooms: 0,
        totalBookings: 0,
        totalRevenue: 0
    });

    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [users, setUsers] = useState([]);

    const getStatusString = (status) => {
        if (typeof status === 'number') {
            return ['pending', 'approved', 'cancelled', 'completed'][status] || 'pending';
        }
        return status?.toLowerCase() || 'pending';
    };

    const fetchDashboardData = async () => {
        try {
            console.log('Fetching admin dashboard data...');
            const [usersRes, roomsRes, bookingsRes] = await Promise.all([
                usersAPI.getAll(),
                roomsAPI.getAll(),
                bookingsAPI.getAll()
            ]);

            console.log('API responses received:', {
                users: usersRes.data?.length,
                rooms: roomsRes.data?.length,
                bookings: bookingsRes.data?.length
            });

            const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
            const roomsData = Array.isArray(roomsRes.data) ? roomsRes.data : [];
            const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];

            // Sort rooms to show booked ones first
            const sortedRooms = [...roomsData].sort((a, b) => {
                if (a.status === 'booked' && b.status !== 'booked') return -1;
                if (a.status !== 'booked' && b.status === 'booked') return 1;
                return 0;
            });

            setUsers(usersData);
            setRooms(sortedRooms);
            setBookings(bookingsData);

            const revenue = bookingsData
                .filter(b => {
                    const statusStr = getStatusString(b.status);
                    return ['completed', 'approved', 'checked_in'].includes(statusStr.toLowerCase());
                })
                .reduce((sum, b) => {
                    const price = parseFloat(b.total_price || b.totalPrice || 0);
                    return sum + (isNaN(price) ? 0 : price);
                }, 0);

            setStats({
                totalUsers: usersData.length,
                totalRooms: roomsData.length,
                totalBookings: bookingsData.length,
                totalRevenue: revenue
            });

            console.log('Dashboard stats calculated:', {
                totalUsers: usersData.length,
                totalRooms: roomsData.length,
                totalBookings: bookingsData.length,
                totalRevenue: revenue
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            // Set empty arrays on error to prevent crashes
            setUsers([]);
            setRooms([]);
            setBookings([]);
            toast.error('Failed to load dashboard data. Please try refreshing.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role !== 'admin' && user.role !== 1) {
            navigate('/');
            return;
        }
        fetchDashboardData();
    }, [user, navigate]);

    const getStatusBadge = (status) => {
        const statusStr = getStatusString(status);
        const styles = {
            pending: 'bg-amber-400 text-white',
            approved: 'bg-emerald-500 text-white',
            completed: 'bg-slate-400 text-white',
            cancelled: 'bg-rose-500 text-white'
        };
        return (
            <span className={`px-3 py-1 rounded-md text-xs font-bold ${styles[statusStr] || styles.pending}`}>
                {statusStr?.charAt(0).toUpperCase() + statusStr?.slice(1)}
            </span>
        );
    };

    const getRoomStatusBadge = (status) => {
        const isAvailable = status === 'available' || status === 0;
        return (
            <span className={`px-3 py-1 rounded-md text-xs font-bold ${isAvailable ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                {isAvailable ? 'Available' : 'Booked'}
            </span>
        );
    };

    const filteredBookings = bookings.filter(b => {
        const search = globalSearch.toLowerCase();
        const statusStr = getStatusString(b.status).toLowerCase();
        return (
            (b.user?.username || '').toLowerCase().includes(search) ||
            (b.room?.name || '').toLowerCase().includes(search) ||
            statusStr.includes(search) ||
            (b.user?.email || '').toLowerCase().includes(search)
        );
    });

    const recentBookings = filteredBookings.slice(0, 4);
    const pendingBookings = bookings.filter(b => getStatusString(b.status) === 'pending').slice(0, 3);

    const priorityTasks = [
        ...bookings.filter(b => getStatusString(b.status) === 'pending').map(b => ({ type: 'booking', data: b })),
        ...rooms.filter(r => r.status === 'maintenance' || r.status === 2).map(r => ({ type: 'maintenance', data: r }))
    ];

    const handleToggleBlock = async (userToUpdate) => {
        const isBlocked = userToUpdate.status === 'blocked' || userToUpdate.status === 1;
        const newStatus = isBlocked ? 'active' : 'blocked';
        if (!window.confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} ${userToUpdate.username}?`)) return;

        try {
            await usersAPI.update(userToUpdate.id, { status: newStatus });
            toast.success(`User updated successfully`);
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Loading Dashboard</p>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 lg:ml-80 flex flex-col transition-all duration-300">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 sticky top-0 z-20">
                    <div className="flex items-center justify-between gap-4">
                        {/* Mobile Menu Button - Left */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaBars size={24} />
                        </button>

                        {/* Top Navigation - Desktop */}
                        <div className="hidden lg:flex items-center gap-8">
                            <Link to="/" className="text-gray-600 hover:text-blue-600 font-semibold flex items-center gap-2">
                                <FaHome /> Home
                            </Link>
                        </div>

                        {/* Search Bar - Flexible */}
                        <div className="flex items-center gap-4 relative flex-1 max-w-md mx-auto lg:mx-8">
                            <div className="relative w-full">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={globalSearch}
                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        {/* Profile Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-3 hover:bg-gray-50 rounded-full p-1 lg:pr-3 transition-colors border border-transparent hover:border-gray-100"
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-blue-50 bg-white">
                                    <img
                                        src={getAvatarUrl(user?.avatar_url) || `https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=3b82f6&color=fff`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-bold text-gray-700 leading-tight">{user?.username || 'Admin'}</p>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Administrator</p>
                                </div>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                                    <div className="px-4 py-2 border-b border-gray-50 mb-2">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account</p>
                                    </div>
                                    <Link
                                        to="/admin/profile"
                                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-bold transition-all"
                                        onClick={() => setShowProfileMenu(false)}
                                    >
                                        <FaUserCircle size={16} />
                                        <span>My Profile</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            toast.success('Logged out successfully');
                                            navigate('/');
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
                </header>

                {/* Main Dashboard Content */}
                <main className="flex-1 overflow-y-auto w-full no-scrollbar">
                    <div className="p-4 md:p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl md:text-3xl font-black text-gray-800">Admin Dashboard</h1>
                        </div>

                        {/* Responsive Flattened Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                            {/* 1. Stats Cards (Full Width) */}
                            <div className="col-span-1 lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <StatCard
                                    icon={FaCalendarCheck}
                                    label="Bookings"
                                    value={stats.totalBookings}
                                    bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
                                />
                                <StatCard
                                    icon={FaHotel}
                                    label="Rooms"
                                    value={stats.totalRooms}
                                    bgColor="bg-gradient-to-br from-cyan-400 to-cyan-500"
                                />
                                <StatCard
                                    icon={FaChartLine}
                                    label="Total Revenue"
                                    value={`Rs.${stats.totalRevenue.toLocaleString()}`}
                                    bgColor="bg-gradient-to-br from-purple-500 to-indigo-600"
                                />
                            </div>

                            {/* 2. Today's Activity (Large) */}
                            <div className="col-span-1 lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
                                <h3 className="text-lg font-black text-gray-800 mb-6">Today's Activity</h3>
                                {(() => {
                                    const today = new Date().toISOString().split('T')[0];

                                    // Calculate stats
                                    const checkIns = bookings.filter(b => {
                                        const dateVal = b.start_date || b.startDate;
                                        if (!dateVal) return false;
                                        try {
                                            const start = new Date(dateVal).toISOString().split('T')[0];
                                            return start === today && b.status !== 'cancelled';
                                        } catch (e) {
                                            return false;
                                        }
                                    }).length;

                                    const checkOuts = bookings.filter(b => {
                                        const dateVal = b.end_date || b.endDate;
                                        if (!dateVal) return false;
                                        try {
                                            const end = new Date(dateVal).toISOString().split('T')[0];
                                            return end === today && b.status !== 'cancelled';
                                        } catch (e) {
                                            return false;
                                        }
                                    }).length;

                                    const pending = bookings.filter(b => {
                                        const status = b.status;
                                        return status === 'pending' || status === 0;
                                    }).length;

                                    const activeRooms = rooms.filter(r => r.status === 'booked' || r.status === 1).length;
                                    const activeBookings = bookings.filter(b => {
                                        const statusStr = getStatusString(b.status).toLowerCase();
                                        if (statusStr !== 'approved') return false;

                                        const startDate = (b.start_date || b.startDate)?.split('T')[0];
                                        const endDate = (b.end_date || b.endDate)?.split('T')[0];
                                        return startDate <= today && endDate >= today;
                                    }).length;

                                    const active = Math.max(activeRooms, activeBookings);

                                    return (
                                        <div className="grid grid-cols-2 gap-4 h-full">
                                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors flex flex-col justify-center">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    <div className="text-blue-600 font-bold text-xs uppercase tracking-wider">Check-ins</div>
                                                </div>
                                                <div className="text-3xl font-black text-blue-700">{checkIns}</div>
                                            </div>

                                            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 hover:bg-purple-100 transition-colors flex flex-col justify-center">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                                    <div className="text-purple-600 font-bold text-xs uppercase tracking-wider">Check-outs</div>
                                                </div>
                                                <div className="text-3xl font-black text-purple-700">{checkOuts}</div>
                                            </div>

                                            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 hover:bg-amber-100 transition-colors flex flex-col justify-center">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                    <div className="text-amber-600 font-bold text-xs uppercase tracking-wider">Pending</div>
                                                </div>
                                                <div className="text-3xl font-black text-amber-700">{pending}</div>
                                            </div>

                                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-colors flex flex-col justify-center">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                    <div className="text-emerald-600 font-bold text-xs uppercase tracking-wider">Occupied</div>
                                                </div>
                                                <div className="text-3xl font-black text-emerald-700">{active}</div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* 3. Room Availability (Small) */}
                            <div className="col-span-1 lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-black text-gray-800 mb-2">Room Availability</h3>
                                <div className="h-48 flex items-center justify-center">
                                    <div className="relative w-40 h-40">
                                        {(() => {
                                            const total = rooms.length || 1;
                                            const today = new Date().toISOString().split('T')[0];
                                            const now = new Date();
                                            const occupiedRoomIds = new Set(
                                                bookings
                                                    .filter(b => {
                                                        const statusStr = getStatusString(b.status);
                                                        if (statusStr === 'cancelled' || statusStr === 'completed') return false;

                                                        const startDate = (b.start_date || b.startDate)?.split('T')[0];
                                                        const endDate = (b.end_date || b.endDate)?.split('T')[0];
                                                        if (!startDate || !endDate) return false;
                                                        return startDate <= today && endDate >= today;
                                                    })
                                                    .map(b => b.room_id)
                                            );

                                            const bookedCount = rooms.filter(r =>
                                                r.status === 'booked' ||
                                                occupiedRoomIds.has(r.id)
                                            ).length;

                                            const percentage = Math.round((bookedCount / total) * 100);
                                            const circumference = 2 * Math.PI * 70;
                                            const strokeDashoffset = circumference - ((percentage / 100) * circumference);

                                            let color = '#3b82f6';
                                            if (percentage > 80) color = '#ef4444';
                                            if (percentage < 30) color = '#10b981';

                                            return (
                                                <>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <div className="text-4xl font-black text-gray-800 transition-all duration-1000">
                                                                {percentage}%
                                                            </div>
                                                            <div className="text-sm font-bold text-gray-500">Occupied</div>
                                                        </div>
                                                    </div>
                                                    <svg className="w-full h-full transform -rotate-90">
                                                        <circle cx="80" cy="80" r="70" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                                                        <circle
                                                            cx="80" cy="80" r="70"
                                                            fill="none"
                                                            stroke={color}
                                                            strokeWidth="12"
                                                            strokeDasharray={circumference}
                                                            strokeDashoffset={strokeDashoffset}
                                                            strokeLinecap="round"
                                                            className="transition-all duration-1000 ease-out"
                                                        />
                                                    </svg>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                                <div className="text-center mt-2">
                                    {(() => {
                                        const now = new Date();
                                        const occupiedRoomIds = new Set(
                                            bookings
                                                .filter(b => {
                                                    const statusStr = getStatusString(b.status);
                                                    if (statusStr === 'cancelled' || statusStr === 'completed') return false;
                                                    const startDate = b.start_date || b.startDate;
                                                    const endDate = b.end_date || b.endDate;
                                                    if (!startDate || !endDate) return false;
                                                    const start = new Date(startDate);
                                                    const end = new Date(endDate);
                                                    return start <= now && end >= now;
                                                })
                                                .map(b => b.room_id)
                                        );
                                        const bookedCount = rooms.filter(r => r.status === 'booked' || occupiedRoomIds.has(r.id)).length;
                                        return (
                                            <p className="text-xs text-gray-500 font-semibold">
                                                {bookedCount} / {rooms.length} Rooms Currently Occupied
                                            </p>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* 4. Priority Tasks (Medium) */}
                            <div className="col-span-1 lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-black text-gray-800">Priority Tasks</h3>
                                    <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-1 rounded-full uppercase">
                                        {priorityTasks.length} ACTION
                                    </span>
                                </div>
                                <div className="space-y-4 flex-1">
                                    {priorityTasks.length > 0 ? (
                                        priorityTasks.map((task, idx) => (
                                            <div key={idx} className={`p-4 rounded-xl border transition-all group ${task.type === 'maintenance' ? 'bg-amber-50 border-amber-100 hover:border-amber-300' : 'bg-blue-50 border-blue-100 hover:border-blue-300'}`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        {task.type === 'maintenance' ? (
                                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm border border-amber-50">
                                                                <FaBed size={18} />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
                                                                <img src={getAvatarUrl(task.data.user?.avatar_url) || `https://ui-avatars.com/api/?name=${task.data.user?.username || 'User'}&background=random`} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800 line-clamp-1">
                                                                {task.type === 'maintenance' ? task.data.name : task.data.user?.username}
                                                            </p>
                                                            <p className={`text-[10px] font-black uppercase tracking-widest ${task.type === 'maintenance' ? 'text-amber-600' : 'text-blue-600'}`}>
                                                                {task.type === 'maintenance' ? 'Needs Maintenance' : 'Pending Approval'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Link to={task.type === 'maintenance' ? "/admin/rooms" : "/admin/bookings"} className="text-xs font-bold text-blue-600 hover:underline">Fix Now</Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <FaCalendarCheck size={20} />
                                            </div>
                                            <p className="text-sm font-bold text-gray-400">System is optimized!</p>
                                        </div>
                                    )}
                                </div>
                                <Link to="/admin/bookings" className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all border border-slate-200/50">
                                    Open All Tasks
                                </Link>
                            </div>

                            {/* 5. Quick User Access (Medium) */}
                            <div className="col-span-1 lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-black text-gray-800">Quick User Access</h3>
                                    <Link to="/admin/users" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
                                </div>
                                <div className="space-y-4">
                                    {users.slice(0, 3).map((userItem) => (
                                        <div key={userItem.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-white">
                                                        <img src={getAvatarUrl(userItem.avatar_url) || `https://ui-avatars.com/api/?name=${userItem.username}&background=3b82f6&color=fff`} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${userItem.status === 'blocked' || userItem.status === 1 ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{userItem.username}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">{userItem.role === 'admin' || userItem.role === 1 ? 'Administrator' : 'General User'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleToggleBlock(userItem)}
                                                disabled={userItem.id === user?.id}
                                                title={userItem.status === 'blocked' || userItem.status === 1 ? 'Unblock' : 'Block'}
                                                className={`p-2 rounded-lg transition-all ${userItem.id === user?.id ? 'opacity-20 cursor-not-allowed' :
                                                    (userItem.status === 'blocked' || userItem.status === 1)
                                                        ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100'
                                                        : 'text-rose-500 bg-rose-50 hover:bg-rose-100'
                                                    }`}
                                            >
                                                {userItem.status === 'blocked' || userItem.status === 1 ? <FaKey size={14} /> : <FaBan size={14} />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 6. Recent Bookings (Full Width) */}
                            <div className="col-span-1 lg:col-span-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                            <FaCalendarAlt size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-800">Recent Bookings</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Latest stay requests</p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/admin/bookings"
                                        className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-gray-200 hover:shadow-xl active:scale-95"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full whitespace-nowrap">
                                        <thead>
                                            <tr className="bg-gray-50/50">
                                                <th className="text-left py-4 px-6 md:px-8 text-[11px] font-black text-gray-500 uppercase tracking-widest">Guest Account</th>
                                                <th className="text-left py-4 px-6 md:px-8 text-[11px] font-black text-gray-500 uppercase tracking-widest">Room</th>
                                                <th className="text-center py-4 px-6 md:px-8 text-[11px] font-black text-gray-500 uppercase tracking-widest">Period</th>
                                                <th className="text-center py-4 px-6 md:px-8 text-[11px] font-black text-gray-500 uppercase tracking-widest">Payment</th>
                                                <th className="text-right py-4 px-6 md:px-8 text-[11px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {recentBookings.map((booking) => (
                                                <tr key={booking.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                                                    <td className="py-5 px-6 md:px-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-11 h-11 rounded-full overflow-hidden bg-white flex-shrink-0 border-2 border-white ring-1 ring-gray-100 shadow-sm">
                                                                <img
                                                                    src={getAvatarUrl(booking.user?.avatar_url) || `https://ui-avatars.com/api/?name=${booking.user?.username || 'G'}&background=random`}
                                                                    alt={booking.user?.username}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-gray-800 tracking-tight">{booking.user?.username || 'Guest'}</p>
                                                                <p className="text-[10px] font-bold text-blue-600 opacity-60">{booking.user?.email || 'No email'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6 md:px-8">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                                                                <img
                                                                    src={booking.room?.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                    alt={booking.room?.name}
                                                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-gray-800 text-sm leading-tight">{booking.room?.name}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{booking.room?.category || 'Standard'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6 md:px-8 text-center">
                                                        <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm group-hover:border-blue-200 transition-colors">
                                                            <span className="text-xs font-black text-gray-700">
                                                                {new Date(booking.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                            </span>
                                                            <FaLongArrowAltRight className="text-blue-500" size={14} />
                                                            <span className="text-xs font-black text-gray-700">
                                                                {new Date(booking.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6 md:px-8 text-center">
                                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${booking.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-600' :
                                                            booking.payment_status === 'failed' ? 'bg-red-100 text-red-600' :
                                                                'bg-yellow-100 text-yellow-600'
                                                            }`}>
                                                            {(booking.payment_status === 'pending_payment' || !booking.payment_status) ? 'Pending' : booking.payment_status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-6 md:px-8 text-right">
                                                        {getStatusBadge(booking.status)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 7. Rooms Overview (Full Width) */}
                            <div className="col-span-1 lg:col-span-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                            <FaHome size={20} />
                                        </div>
                                        <h3 className="text-lg font-black text-gray-800">Rooms Overview</h3>
                                    </div>
                                    <Link to="/admin/rooms" className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                        Manage All
                                    </Link>
                                </div>
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full whitespace-nowrap">
                                        <thead>
                                            <tr className="border-b border-gray-100 pb-4">
                                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Room Name</th>
                                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rooms.slice(0, 4).map((room) => (
                                                <tr key={room.id} className="group border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-8 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 shadow-sm bg-gray-50">
                                                                <img
                                                                    src={room.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
                                                                    className="w-full h-full object-cover"
                                                                    alt=""
                                                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' }}
                                                                />
                                                            </div>
                                                            <span className="font-bold text-gray-700 text-sm truncate max-w-[120px]">{room.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-tighter">
                                                            {room.category?.replace('_', ' ') || 'Standard'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">{getRoomStatusBadge(room.status)}</td>
                                                    <td className="py-4 px-4">
                                                        <Link to="/admin/rooms" className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors inline-block">
                                                            <FaEdit size={14} />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div >
        </div >
    );
};

export default AdminDashboard;
