import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaBed, FaUsers, FaWifi, FaTv, FaSnowflake, FaArrowLeft } from 'react-icons/fa';
import { roomsAPI, reviewsAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [room, setRoom] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: ''
    });
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        paymentMethod: 'pay_at_hotel'
    });

    useEffect(() => {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 1);

        setBookingData(prev => ({
            ...prev,
            checkIn: formatDateTime(new Date(2026, 1, 17, 14, 0)), // Match minCheckIn
            checkOut: formatDateTime(new Date(2026, 1, 18, 11, 0))
        }));
    }, []);

    // Calculate valid date ranges for 2026
    const today = new Date();
    const currentYear = 2026;

    // Format: YYYY-MM-DDTHH:mm
    const formatDateTime = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Default check-in time: 14:00 (2 PM)
    // Default check-out time: 11:00 (11 AM)
    const getDefaultDateTime = (date, hours) => {
        const d = new Date(date);
        d.setHours(hours, 0, 0, 0);
        return formatDateTime(d);
    };

    // Min date is today if in 2026, otherwise start of 2026
    const minCheckIn = formatDateTime(new Date(2026, 1, 17, 14, 0)); // February 17, 2026, 2:00 PM
    const maxDate = '2026-12-31T23:59';

    // Min check-out is check-in + 1 day
    const getMinCheckOut = () => {
        if (!bookingData.checkIn) return minCheckIn;
        const checkInDate = new Date(bookingData.checkIn);
        checkInDate.setDate(checkInDate.getDate() + 1);
        checkInDate.setHours(11, 0, 0, 0);
        return formatDateTime(checkInDate);
    };

    useEffect(() => {
        fetchRoomDetails();
    }, [id]);

    const fetchRoomDetails = async () => {
        try {
            const response = await roomsAPI.getById(id);
            setRoom(response.data);
            const reviewsResponse = await reviewsAPI.getByRoom(id);
            setReviews(reviewsResponse.data);
        } catch (error) {
            toast.error('Failed to fetch room details');
            navigate('/rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please login to book a room');
            navigate('/login');
            return;
        }

        if (!bookingData.checkIn || !bookingData.checkOut) {
            toast.error('Please select check-in and check-out dates');
            return;
        }

        const start = new Date(bookingData.checkIn);
        const end = new Date(bookingData.checkOut);

        if (end <= start) {
            toast.error('Check-out date must be after check-in date');
            return;
        }

        try {
            await bookingsAPI.create({
                user_id: user.id,
                room_id: room.id,
                start_date: new Date(bookingData.checkIn).toISOString(),
                end_date: new Date(bookingData.checkOut).toISOString(),
                status: 'pending',
                payment_method: bookingData.paymentMethod,
                payment_status: 'pending_payment'
            });
            toast.success('Room booked successfully!');
            navigate('/bookings');
        } catch (error) {
            console.error('Booking Error:', error);

            let errorMessage = 'Failed to book room';
            if (error.response?.data) {
                const data = error.response.data;
                if (data.errors && Array.isArray(data.errors)) {
                    errorMessage = data.errors.join(', ');
                } else if (typeof data.errors === 'object') {
                    errorMessage = Object.values(data.errors).flat().join(', ');
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (data.message) {
                    errorMessage = data.message;
                }

                if (JSON.stringify(data).includes('Room is not available')) {
                    errorMessage = 'Room is not available for the selected dates';
                }
            }

            toast.error(errorMessage);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to write a review');
            navigate('/login');
            return;
        }

        try {
            await reviewsAPI.create(id, {
                ...reviewData,
                user_id: user.id
            });
            toast.success('Review submitted successfully!');
            setShowReviewForm(false);
            setReviewData({ rating: 5, comment: '' });
            fetchRoomDetails();
        } catch (error) {
            toast.error('Failed to submit review');
        }
    };

    const getRoomImage = (room) => {
        if (room?.image && room.image.startsWith('http') && !room.image.includes('placeholder')) {
            return room.image;
        }

        const fallbacks = {
            single: [
                'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1631049307208-950375b617ef?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800'
            ],
            couple: [
                'https://images.unsplash.com/photo-1590490360182-c33d59735310?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1591088398332-8a77d399e875?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
            ],
            family: [
                'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=800'
            ],
            suite: [
                'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1578683010236-d716f9759678?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1591088398332-8a77d399e875?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1556784344-964228965f3d?auto=format&fit=crop&q=80&w=800'
            ]
        };

        const cat = String(room?.category || '').toLowerCase();
        let list = fallbacks.single;
        if (cat.includes('couple') || cat.includes('double')) list = fallbacks.couple;
        else if (cat.includes('family')) list = fallbacks.family;
        else if (cat.includes('presidential') || cat.includes('suite') || cat.includes('elite')) list = fallbacks.suite;

        const id = parseInt(room?.id) || 0;
        const index = id % list.length;
        return list[index];
    };

    const getCategoryLabel = (category) => {
        const labels = {
            'single_room': 'Luxurious Single',
            'couple_room': 'Romantic Couple',
            'family_room': 'Grand Family',
            'presidential_room': 'Presidential Suite'
        };
        return labels[category] || category;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading room details...</p>
                </div>
            </div>
        );
    }

    if (!room) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12 md:pb-20">
            <div className="container mx-auto px-4 md:px-6 pt-6 md:pt-8">
                <button
                    onClick={() => navigate('/rooms')}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-sm md:text-base mb-4 transition-colors"
                >
                    <FaArrowLeft /> Back to Rooms
                </button>
            </div>

            <div className="relative h-64 md:h-80 lg:h-96 w-full">
                <img
                    src={getRoomImage(room)}
                    alt={room.name}
                    className="w-full h-full object-cover shadow-inner"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200';
                    }}
                />
                {room.is_featured && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] md:text-sm font-black px-3 py-1 md:px-4 md:py-2 rounded-full shadow-lg uppercase tracking-wider">
                        ⭐ Featured
                    </div>
                )}
            </div>

            <div className="container mx-auto px-4 md:px-6 -mt-16 md:-mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 md:mb-8 gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-2 md:mb-3 leading-tight">{room.name}</h1>
                                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-slate-600">
                                        <span className="flex items-center gap-1 font-bold">
                                            <FaStar className="text-yellow-400" /> {room.rating || 0}
                                        </span>
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-black uppercase tracking-wider text-[10px] md:text-xs border border-indigo-100">
                                            {getCategoryLabel(room.category)}
                                        </span>
                                        {(room.status === 'available' || room.status === 0) ? (
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-black uppercase tracking-wider text-[10px] md:text-xs border border-emerald-100">
                                                ● Available Now
                                            </span>
                                        ) : (room.status === 'booked' || room.status === 1) ? (
                                            <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-black uppercase tracking-wider text-[10px] md:text-xs border border-amber-100">
                                                ● Occupied / Booked
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full font-black uppercase tracking-wider text-[10px] md:text-xs border border-rose-100">
                                                ● Currently Unavailable
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-2 md:text-right border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                                    <p className="text-2xl md:text-3xl font-black text-slate-900">Rs.{room.price}</p>
                                    <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wide">per night</p>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-6 md:pt-8 mb-6 md:mb-8">
                                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-3 md:mb-4">About This Room</h3>
                                <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6 font-medium">{room.description}</p>
                                <div className="flex flex-wrap gap-4 md:gap-6 text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wide">
                                    <span className="flex items-center gap-2">
                                        <FaUsers className="text-indigo-400" size={16} /> Up to {room.capacity} guests
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <FaBed className="text-indigo-400" size={16} /> Spacious beds
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-6 md:pt-8">
                                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-4 md:mb-6">Amenities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-sm"><FaWifi /></div>
                                        <span className="text-xs md:text-sm font-bold text-slate-700">Free WiFi</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-sm"><FaTv /></div>
                                        <span className="text-xs md:text-sm font-bold text-slate-700">Smart TV</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-sm"><FaSnowflake /></div>
                                        <span className="text-xs md:text-sm font-bold text-slate-700">AC</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Write Review Form moved to Left Side */}
                        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 border border-indigo-50">
                            <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 font-black uppercase tracking-widest text-[10px] text-slate-400 border-b border-slate-100 pb-2">Share Your Experience</h3>
                            {!showReviewForm ? (
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            toast.error('Please login to write a review');
                                            navigate('/login');
                                        } else {
                                            setShowReviewForm(true);
                                        }
                                    }}
                                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]"
                                >
                                    Write a Customer Review
                                </button>
                            ) : (
                                <form onSubmit={handleReviewSubmit} className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-black text-slate-900 text-lg">Write Review</h4>
                                        <button type="button" onClick={() => setShowReviewForm(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Rating Score</label>
                                        <div className="flex items-center gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm w-max">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                    className="focus:outline-none transform hover:scale-110 transition-transform"
                                                >
                                                    <FaStar
                                                        size={24}
                                                        className={`${star <= reviewData.rating ? 'text-yellow-400' : 'text-slate-200'} transition-colors`}
                                                    />
                                                </button>
                                            ))}
                                            <span className="ml-3 text-xs font-bold text-slate-500 uppercase tracking-wide border-l border-slate-200 pl-3">
                                                {reviewData.rating}.0
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Experience</label>
                                        <textarea
                                            value={reviewData.comment}
                                            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                            placeholder="Share your experience with us..."
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none resize-none text-sm font-medium shadow-sm h-32"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/30"
                                    >
                                        Submit Review
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100/50">
                            <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 md:mb-8 pb-4 border-b border-slate-100">Book Reservation</h3>

                            <div className="space-y-5 md:space-y-6">
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-in</label>
                                        <input
                                            type="datetime-local"
                                            value={bookingData.checkIn}
                                            min={minCheckIn}
                                            max={maxDate}
                                            onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                                            className="w-full px-3 py-3 md:px-4 md:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all text-xs md:text-sm font-bold text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-out</label>
                                        <input
                                            type="datetime-local"
                                            value={bookingData.checkOut}
                                            min={getMinCheckOut()}
                                            max={maxDate}
                                            onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                                            className="w-full px-3 py-3 md:px-4 md:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all text-xs md:text-sm font-bold text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Guests</label>
                                    <div className="relative">
                                        <select
                                            value={bookingData.guests}
                                            onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none appearance-none transition-all text-sm font-bold text-slate-700"
                                        >
                                            {[...Array(room.capacity)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                        <FaUsers className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</label>
                                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                                        <button
                                            onClick={() => setBookingData({ ...bookingData, paymentMethod: 'pay_at_hotel' })}
                                            className={`px-4 py-3 md:py-4 rounded-xl text-xs md:text-sm font-bold transition-all border-2 w-full flex items-center justify-center gap-2 ${bookingData.paymentMethod === 'pay_at_hotel'
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200'
                                                }`}
                                        >
                                            <span className="w-2 h-2 rounded-full bg-current"></span> Pay Cash at Hotel
                                        </button>
                                        <button
                                            onClick={() => setBookingData({ ...bookingData, paymentMethod: 'bank_transfer' })}
                                            className={`px-4 py-3 md:py-4 rounded-xl text-xs md:text-sm font-bold transition-all border-2 w-full flex items-center justify-center gap-2 ${bookingData.paymentMethod === 'bank_transfer'
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200'
                                                }`}
                                        >
                                            <span className="w-2 h-2 rounded-full bg-current"></span> Bank Transfer
                                        </button>
                                    </div>

                                    {bookingData.paymentMethod === 'bank_transfer' && (
                                        <div className="mt-4 p-4 md:p-5 bg-slate-900 rounded-2xl border border-slate-800 text-white relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-white/10 pb-2">Bank Details</h4>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400 text-xs">Bank Name:</span>
                                                    <span className="font-bold">Habib Bank Limited</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400 text-xs text-[10px] uppercase">Account Title:</span>
                                                    <span className="font-bold text-indigo-400">Monarch Official</span>
                                                </div>
                                                <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center mt-2 group-hover:bg-white/15 transition-colors cursor-pointer" onClick={() => { navigator.clipboard.writeText("1234567890123456"); toast.success("Copied!"); }}>
                                                    <span className="font-mono text-xs text-slate-300">1234-5678-9012-3456</span>
                                                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-bold">COPY</span>
                                                </div>
                                                <p className="text-[10px] text-orange-300 mt-2 font-medium flex items-center gap-1">
                                                    ⚠️ Send receipt screenshot via WhatsApp.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-dashed border-slate-200 pt-6 space-y-3">
                                    <div className="flex justify-between items-center text-slate-500 text-xs md:text-sm font-medium">
                                        <span>Price per night</span>
                                        <span className="font-bold text-slate-900">Rs.{room.price.toLocaleString()}</span>
                                    </div>
                                    {bookingData.checkIn && bookingData.checkOut && (
                                        <div className="flex justify-between items-center text-slate-500 text-xs md:text-sm font-medium">
                                            <span>Duration</span>
                                            <span className="font-bold text-slate-900">
                                                {Math.max(1, Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24)))} Nights
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                        <span className="text-sm font-bold text-slate-500">Total Amount</span>
                                        <span className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tight">Rs.{bookingData.checkIn && bookingData.checkOut && !isNaN(new Date(bookingData.checkIn)) && !isNaN(new Date(bookingData.checkOut))
                                            ? (room.price * Math.max(1, Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24)))).toLocaleString()
                                            : room.price.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    disabled={room.status !== 'available' && room.status !== 0}
                                    className={`w-full py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl transition-all transform ${(room.status === 'available' || room.status === 0)
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 hover:-translate-y-1 active:scale-[0.98]'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    {(room.status === 'available' || room.status === 0) ? 'Confirm Booking' : (room.status === 'booked' || room.status === 1) ? 'Room Already Booked' : 'Not Available'}
                                </button>
                            </div>
                        </div>

                        {/* Reviews moved here */}
                        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6 md:mb-8">
                                <h3 className="text-lg md:text-xl font-black text-slate-900">Guest Reviews</h3>
                                <span className="text-xs md:text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{reviews.length} reviews</span>
                            </div>

                            <div className="space-y-6 md:space-y-8">
                                {reviews.length === 0 ? (
                                    <div className="text-center py-8 md:py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-slate-400 font-bold text-sm">No reviews yet.</p>
                                    </div>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.id} className="border-b border-slate-100 pb-6 md:pb-8 last:border-0 last:pb-0">
                                            <div className="flex items-start gap-3 md:gap-4">
                                                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm md:text-base shadow-lg shadow-indigo-500/20">
                                                    {review.user?.username?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                                                        <p className="font-bold text-slate-900 text-[13px] md:text-sm">{review.user?.username || 'Anonymous'}</p>
                                                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex text-yellow-400 mb-2 text-[10px] md:text-xs">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-slate-200'} />
                                                        ))}
                                                    </div>
                                                    <p className="text-slate-600 text-[13px] leading-relaxed font-medium bg-slate-50 p-3 rounded-lg rounded-tl-none">{review.comment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
