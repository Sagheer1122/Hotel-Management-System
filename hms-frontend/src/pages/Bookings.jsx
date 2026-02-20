import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock, FaArrowRight, FaHotel, FaUser, FaInfoCircle, FaMapMarkerAlt, FaBed, FaUserFriends, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import { toast } from 'react-toastify';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { user, isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user) {
            fetchBookings();
        }
    }, [user, isAuthenticated, navigate]);

    const fetchBookings = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const params = isAdmin() ? {} : { user_id: user.id };
            const response = await bookingsAPI.getAll(params);
            setBookings(response.data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const updateData = { status: newStatus };
            if (newStatus === 'cancelled') {
                updateData.payment_status = 'failed';
            }
            await bookingsAPI.update(id, updateData);
            toast.success(`Booking ${newStatus} successfully`);
            fetchBookings();
            if (selectedBooking && selectedBooking.id === id) {
                setSelectedBooking(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            toast.error('Failed to update booking status');
        }
    };

    const getStatusStyles = (status) => {
        const s = typeof status === 'number' ? ['pending', 'approved', 'cancelled', 'completed'][status] : status?.toLowerCase();
        switch (s) {
            case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'completed': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        const s = typeof status === 'number' ? ['pending', 'approved', 'cancelled', 'completed'][status] : status?.toLowerCase();
        switch (s) {
            case 'approved': return <FaCheckCircle size={12} />;
            case 'pending': return <FaClock size={12} />;
            case 'cancelled': return <FaTimesCircle size={12} />;
            case 'completed': return <FaCheckCircle size={12} />;
            default: return <FaClock size={12} />;
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        const s = typeof booking.status === 'number' ? ['pending', 'approved', 'cancelled', 'completed'][booking.status] : booking.status?.toLowerCase();
        return s === filter;
    });

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50/50">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-6 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Bookings...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24 relative pt-16 md:pt-0">
            <div className="bg-white border-b border-slate-100 mb-8 md:mb-12">
                <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3 md:mb-4">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50 rounded-lg md:rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-100">
                                    <FaCalendarAlt size={16} className="md:w-5 md:h-5" />
                                </div>
                                <span className="text-slate-400 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em]">Management Portal</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
                                {isAdmin() ? 'Reservation' : 'My'}<span className="text-indigo-600"> Bookings</span>
                            </h1>
                            <p className="mt-2 md:mt-4 text-xs md:text-base text-slate-500 font-medium max-w-xl">
                                {isAdmin()
                                    ? 'Monitor and manage all guest reservations across the entire The Monarch Hotel network.'
                                    : 'Review your residency history and manage upcoming stays with our premium concierge tools.'}
                            </p>
                        </div>
                        {!isAdmin() && (
                            <Link to="/rooms" className="w-full md:w-auto group flex items-center justify-center gap-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                                + New Reservation
                                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6">
                {/* Scrollable Filter Buttons */}
                <div className="overflow-x-auto pb-4 md:pb-0 mb-8 md:mb-12 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex gap-2 md:gap-3 min-w-max">
                        {['all', 'pending', 'approved', 'cancelled', 'completed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-5 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all whitespace-nowrap ${filter === status
                                    ? 'bg-slate-900 text-white shadow-lg md:shadow-xl shadow-slate-900/20'
                                    : 'bg-white text-slate-500 hover:text-indigo-600 border border-slate-100'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl md:rounded-[3rem] border border-slate-100 p-8 md:p-24 text-center">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 rounded-xl md:rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto mb-6 md:mb-8 shadow-inner">
                            <FaCalendarAlt size={32} className="md:w-12 md:h-12" />
                        </div>
                        <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight">No Reservatons Recorded</h3>
                        <p className="text-sm md:text-base text-slate-400 font-medium max-w-md mx-auto mb-6 md:mb-10">
                            The archive for this category is currently empty. Start your journey by browsing our exclusive collection.
                        </p>
                        {!isAdmin() && (
                            <Link to="/rooms" className="inline-block px-6 md:px-10 py-3 md:py-4 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded-xl md:rounded-2xl transition-all">
                                Travel our collection →
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredBookings.map((booking) => (
                            <div key={booking.id} className="group bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col overflow-hidden">
                                <div className="h-48 md:h-56 overflow-hidden relative">
                                    <img
                                        src={booking.room?.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 font-sans"
                                        alt={booking.room?.name}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' }}
                                    />
                                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                                    <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-2">
                                        <div className="bg-white/95 backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-lg">
                                            #{booking.id}
                                        </div>
                                        <div className={`px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-lg backdrop-blur-md ${getStatusStyles(booking.status)}`}>
                                            {getStatusIcon(booking.status)}
                                            {typeof booking.status === 'number'
                                                ? ['Pending', 'Approved', 'Cancelled', 'Completed'][booking.status]
                                                : booking.status
                                            }
                                        </div>
                                    </div>
                                    {isAdmin() && booking.user && (
                                        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                                            <div className="bg-slate-900/40 backdrop-blur-xl p-2 md:p-3 rounded-xl md:rounded-2xl border border-white/10 flex items-center gap-3">
                                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                                    <FaUser size={10} className="md:w-3 md:h-3" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] md:text-[8px] font-black text-indigo-300 uppercase tracking-widest leading-none mb-0.5 md:mb-1">Guest Holder</span>
                                                    <span className="text-white text-[10px] md:text-xs font-bold truncate">{booking.user.username}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 md:p-8 flex-1 flex flex-col">
                                    <div className="mb-4 md:mb-6">
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors tracking-tight">
                                            {booking.room?.name || 'Luxury Resident'}
                                        </h3>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-wider">
                                            <span className="text-indigo-500 italic">{new Date(booking.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                            <span>—</span>
                                            <span className="text-indigo-500 italic">{new Date(booking.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto border-t border-slate-50 pt-6 md:pt-8">
                                        <div className="flex justify-between items-baseline mb-6 md:mb-8">
                                            <span className="text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em]">Transaction Total</span>
                                            <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Rs.{booking.total_price}</span>
                                        </div>
                                        {isAdmin() && (typeof booking.status === 'number' ? booking.status === 0 : booking.status === 'pending') ? (
                                            <div className="flex gap-3 md:gap-4">
                                                <button onClick={() => handleStatusUpdate(booking.id, 'approved')} className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm hover:shadow-lg">Confirm</button>
                                                <button onClick={() => handleStatusUpdate(booking.id, 'cancelled')} className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white shadow-sm hover:shadow-lg">Dismiss</button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {!isAdmin() && (typeof booking.status === 'number' ? booking.status === 1 : booking.status === 'approved') && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                                        className="w-full py-3 md:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                                                    >
                                                        Complete Stay
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="w-full py-3 md:py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                                                >
                                                    Residency Details
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedBooking && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-10">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500" onClick={() => setSelectedBooking(null)}></div>
                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl animate-fade-in flex flex-col md:flex-row border border-white/20">

                        <div className="w-full md:w-1/2 h-48 sm:h-64 md:h-auto overflow-hidden relative shrink-0">
                            <img
                                src={selectedBooking.room?.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=90'}
                                alt={selectedBooking.room?.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 text-white">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-2 md:mb-3 inline-block">{selectedBooking.room?.category?.replace('_', ' ')}</span>
                                <h4 className="text-2xl md:text-3xl font-black tracking-tight">{selectedBooking.room?.name}</h4>
                            </div>
                            <button onClick={() => setSelectedBooking(null)} className="absolute top-4 left-4 md:top-6 md:left-6 p-3 md:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl text-white transition-all">
                                <FaTimes size={16} className="md:w-[18px] md:h-[18px]" />
                            </button>
                        </div>

                        <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto">
                            <div className="flex justify-between items-start mb-6 md:mb-10">
                                <div>
                                    <p className="text-slate-400 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-1">Booking Record</p>
                                    <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">#{selectedBooking.id}</h4>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <div className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${getStatusStyles(selectedBooking.status)}`}>
                                        {getStatusIcon(selectedBooking.status)}
                                        {typeof selectedBooking.status === 'number' ? ['Pending', 'Approved', 'Cancelled', 'Completed'][selectedBooking.status] : selectedBooking.status}
                                    </div>
                                    <div className={`px-2 md:px-3 py-1 rounded md:rounded-lg text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${selectedBooking.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                        selectedBooking.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        Payment: {selectedBooking.payment_status?.replace('_', ' ') || 'Pending'}
                                    </div>
                                    <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                        Method: {selectedBooking.payment_method?.replace('_', ' ') || 'Pay at Hotel'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-10">
                                <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                                    <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2 flex items-center gap-2"><FaCalendarAlt className="text-indigo-400" /> Check In</p>
                                    <p className="text-xs md:text-sm font-bold text-slate-900">{new Date(selectedBooking.start_date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                                    <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2 flex items-center gap-2"><FaCalendarAlt className="text-indigo-400" /> Check Out</p>
                                    <p className="text-xs md:text-sm font-bold text-slate-900">{new Date(selectedBooking.end_date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                                <div className="flex items-center gap-3 md:gap-4 group">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50 rounded-lg md:rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <FaBed size={14} className="md:w-4 md:h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Room Selection</p>
                                        <p className="text-xs md:text-sm font-bold text-slate-700">{selectedBooking.room?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 md:gap-4 group">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50 rounded-lg md:rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <FaUserFriends size={14} className="md:w-4 md:h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Guest Account</p>
                                        <p className="text-xs md:text-sm font-bold text-slate-700">{user?.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 md:gap-4 group">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50 rounded-lg md:rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <FaMapMarkerAlt size={14} className="md:w-4 md:h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Location Status</p>
                                        <p className="text-xs md:text-sm font-bold text-slate-700">Monarch Main Branch • Executive Wing</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 md:pt-8 border-t border-slate-100">
                                <p className="text-[10px] md:text-xs font-bold text-slate-400">Grand Total Amount</p>
                                <h5 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">Rs.{selectedBooking.total_price}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
