import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../../components/admin/Sidebar';
import {
    FaHotel,
    FaSearch,
    FaCheck,
    FaTimes,
    FaUserCircle,
    FaSignOutAlt,
    FaCreditCard,
    FaMoneyBillWave,
    FaHistory,
    FaBars,
    FaHome
} from 'react-icons/fa';

const AdminPayments = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const API_BASE_URL = 'https://hotel-management-system-uqxt.onrender.com';

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
            toast.error('Failed to load transaction data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePaymentStatus = async (id, payment_status) => {
        try {
            await bookingsAPI.update(id, { payment_status });
            toast.success(`Payment status updated to ${payment_status}`);
            fetchBookings();
        } catch (error) {
            console.error('Error updating payment status:', error);
            let msg = 'Update failed';
            if (error.response?.data) {
                if (error.response.data.errors) {
                    msg = Array.isArray(error.response.data.errors)
                        ? error.response.data.errors.join(', ')
                        : JSON.stringify(error.response.data.errors);
                } else if (typeof error.response.data === 'object') {
                    msg = Object.entries(error.response.data)
                        .map(([k, v]) => `${k} ${v}`)
                        .join('. ');
                }
            } else {
                msg = error.message;
            }
            toast.error(msg);
        }
    };

    const getPaymentStatusBadge = (status) => {
        // Handle both integer (legacy) and string statuses
        const statusMap = ['pending_payment', 'paid', 'failed', 'refunded'];
        const statusStr = typeof status === 'number'
            ? statusMap[status]
            : (status?.toLowerCase() || 'pending_payment');

        const styles = {
            pending_payment: 'bg-amber-100 text-amber-700 border border-amber-200',
            paid: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
            failed: 'bg-rose-100 text-rose-700 border border-rose-200',
            refunded: 'bg-slate-100 text-slate-700 border border-slate-200'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[statusStr] || styles.pending_payment}`}>
                {statusStr === 'pending_payment' ? 'pending' : statusStr.replace('_', ' ')}
            </span>
        );
    };

    const filteredBookings = bookings.filter(booking => {
        const statusMap = ['pending_payment', 'paid', 'failed', 'refunded'];
        const rawStatus = (booking.payment_status || 'pending_payment');
        const statusStr = typeof rawStatus === 'number'
            ? statusMap[rawStatus]
            : rawStatus.toLowerCase();

        // Normalize 'pending_payment' to 'pending' for filtering
        const normalizedStatus = statusStr === 'pending_payment' ? 'pending' : statusStr;

        const matchesFilter = filter === 'all' || normalizedStatus === filter;
        const matchesSearch =
            booking.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.room?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const totalRevenue = bookings
        .filter(b => {
            const statusMap = ['pending_payment', 'paid', 'failed', 'refunded'];
            const s = typeof b.payment_status === 'number' ? statusMap[b.payment_status] : b.payment_status;
            return s === 'paid';
        })
        .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

    const pendingRevenue = bookings
        .filter(b => b.payment_status !== 'paid' && b.status !== 'cancelled')
        .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-slate-900">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 lg:ml-80 flex flex-col min-w-0">
                {/* Header */}
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
                            <Link to="/" className="text-gray-500 hover:text-indigo-600 font-bold text-sm flex items-center gap-2">
                                <FaHome size={16} /> Home
                            </Link>
                        </div>

                        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search transactions by guest or room..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-600 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-3 hover:bg-slate-50 rounded-full p-1 pr-3 transition-colors border border-transparent hover:border-slate-100"
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-indigo-50 bg-white">
                                        <img
                                            src={getAvatarUrl(user?.avatar_url) || `https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=4f46e5&color=fff`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-left hidden sm:block">
                                        <p className="text-sm font-bold text-slate-800 leading-tight">{user?.username || 'Admin'}</p>
                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Administrator</p>
                                    </div>
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                                        <div className="px-4 py-2 border-b border-slate-50 mb-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
                                        </div>
                                        <Link
                                            to="/admin/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-bold transition-all"
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
                    {/* Revenue Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-[2.5rem] text-white shadow-2xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <FaMoneyBillWave size={24} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Total Collected</span>
                            </div>
                            <h3 className="text-4xl font-black tracking-tighter">Rs. {totalRevenue.toLocaleString()}</h3>
                            <p className="text-xs font-bold mt-2 opacity-60 uppercase tracking-widest">Verified Revenue</p>
                        </div>

                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                                    <FaHistory size={24} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Pending Invoices</span>
                            </div>
                            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">Rs. {pendingRevenue.toLocaleString()}</h3>
                            <p className="text-xs font-bold mt-2 text-amber-500 uppercase tracking-widest">Awaiting Verification</p>
                        </div>

                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center">
                            <div className="w-full text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Transaction Health</p>
                                <div className="flex justify-center gap-4">
                                    <div className="px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <p className="text-2xl font-black text-emerald-600">{bookings.filter(b => b.payment_status === 'paid').length}</p>
                                        <p className="text-[8px] font-black text-emerald-600/60 uppercase">Paid</p>
                                    </div>
                                    <div className="px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100">
                                        <p className="text-2xl font-black text-amber-600">{bookings.filter(b => b.payment_status === 'pending' || !b.payment_status).length}</p>
                                        <p className="text-[8px] font-black text-amber-600/60 uppercase">Pending</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Transaction Log</h3>
                        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200">
                            {['all', 'pending', 'paid', 'failed'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payments Table */}
                    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden mb-12">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction / Room</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User Account</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-indigo-50/30 transition-all duration-300 group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 group-hover:scale-110 transition-transform">
                                                        <img
                                                            src={booking.room?.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 tracking-tight">{booking.room?.name || 'Unknown Room'}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: TRN-{booking.id * 1024}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                                                        <img
                                                            src={getAvatarUrl(booking.user?.avatar_url) || `https://ui-avatars.com/api/?name=${booking.user?.username || 'G'}&background=4f46e5&color=fff`}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800">{booking.user?.username || 'Guest'}</p>
                                                        <p className="text-[10px] font-bold text-slate-400">{booking.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-800">Rs. {parseFloat(booking.total_price).toLocaleString()}</span>
                                                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">Debit/Credit</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {getPaymentStatusBadge(booking.payment_status)}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {(booking.payment_status !== 'paid') && (
                                                        <button
                                                            onClick={() => handleUpdatePaymentStatus(booking.id, 'paid')}
                                                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
                                                        >
                                                            <FaCheck size={10} /> Approve
                                                        </button>
                                                    )}
                                                    {booking.payment_status === 'paid' && (
                                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                            <FaCheck /> Verified
                                                        </span>
                                                    )}
                                                    {(booking.payment_status === 'pending' || !booking.payment_status) && (
                                                        <button
                                                            onClick={() => handleUpdatePaymentStatus(booking.id, 'failed')}
                                                            className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                                                        >
                                                            <FaTimes size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredBookings.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-4">
                                                        <FaCreditCard size={32} />
                                                    </div>
                                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching transactions found</p>
                                                </div>
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

export default AdminPayments;
