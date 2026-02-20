import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI, roomsAPI } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../../components/admin/Sidebar';
import {
    FaHotel,
    FaUsers,
    FaBed,
    FaCalendarAlt,
    FaSignOutAlt,
    FaSearch,
    FaBell,
    FaCheck,
    FaTimes,
    FaUserCircle,
    FaFilter,
    FaEnvelope,
    FaBars,
    FaHome
} from 'react-icons/fa';

const AdminBookings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const API_BASE_URL = 'http://localhost:3000';

    const getAvatarUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingsAPI.getAll();
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const updateData = { status };
            if (status === 'cancelled') {
                updateData.payment_status = 'failed';
            }
            await bookingsAPI.update(id, updateData);
            toast.success(`Booking ${status} successfully`);
            fetchBookings();
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error('Failed to update booking status');
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        try {
            await bookingsAPI.delete(id);
            toast.success('Booking deleted successfully');
            fetchBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
            toast.error('Failed to delete booking');
        }
    };

    const getStatusBadge = (status) => {
        const statusStr = typeof status === 'number'
            ? ['pending', 'approved', 'cancelled', 'completed'][status]
            : status?.toLowerCase();

        const styles = {
            pending: 'bg-amber-100 text-amber-700 border border-amber-200',
            approved: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
            completed: 'bg-slate-100 text-slate-700 border border-slate-200',
            cancelled: 'bg-rose-100 text-rose-700 border border-rose-200'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[statusStr] || styles.pending}`}>
                {statusStr?.charAt(0).toUpperCase() + statusStr?.slice(1)}
            </span>
        );
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === 'all' ||
            (typeof booking.status === 'string' ? booking.status === filter :
                ['pending', 'approved', 'cancelled', 'completed'][booking.status] === filter);

        const matchesSearch =
            booking.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.room?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

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
                                placeholder="Search by guest, room, or booking ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-slate-600 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 relative">

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
                    </div>
                </header>

                <main className="p-8 no-scrollbar">
                    <div className="flex flex-col sm:flex-row justify-end gap-4 mb-8">
                        <div className="flex gap-2">
                            {['all', 'pending', 'approved', 'completed', 'cancelled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${filter === status
                                        ? 'bg-slate-800 text-white shadow-lg shadow-slate-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>


                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Booking Details</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Dates</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                        <img
                                                            src={booking.room?.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
                                                            alt={booking.room?.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541971875076-8f97bc3533d2?auto=format&fit=crop&w=400&q=80' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{booking.room?.name || 'Unknown Room'}</p>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">#{booking.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-white">
                                                        <img
                                                            src={getAvatarUrl(booking.user?.avatar_url) || `https://ui-avatars.com/api/?name=${booking.user?.username || 'User'}&background=3b82f6&color=fff`}
                                                            alt={booking.user?.username}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{booking.user?.username || 'Unknown User'}</p>
                                                        <p className="text-xs font-bold text-slate-500">{booking.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-slate-600">
                                                    <p>{new Date(booking.start_date).toLocaleDateString()}</p>
                                                    <p className="text-slate-400 text-xs">to</p>
                                                    <p>{new Date(booking.end_date).toLocaleDateString()}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-black text-slate-800">Rs.{booking.total_price}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(booking.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(booking.status === 'pending' || booking.status === 0) && (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(booking.id, 'approved')}
                                                                className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                                                                title="Approve"
                                                            >
                                                                <FaCheck size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                                                className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
                                                                title="Cancel"
                                                            >
                                                                <FaTimes size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {(booking.status === 'approved' || booking.status === 1) && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                            title="Mark Completed"
                                                        >
                                                            <FaCheck size={14} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteBooking(booking.id)}
                                                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FaFilter size={14} className="rotate-45" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredBookings.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-bold">
                                                No bookings found matching your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminBookings;
