import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reviewsAPI } from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import {
    FaStar,
    FaTrash,
    FaSearch,
    FaExclamationCircle,
    FaUserCircle,
    FaHotel,
    FaQuoteLeft,
    FaBars
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminReviews = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const fetchReviews = async () => {
        try {
            const response = await reviewsAPI.getAll();
            setReviews(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role !== 'admin' && user.role !== 1) {
            navigate('/');
            return;
        }
        fetchReviews();
    }, [user, navigate]);

    const handleDeleteReview = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;

        try {
            await reviewsAPI.delete(id);
            setReviews(reviews.filter(r => r.id !== id));
            toast.success('Review deleted successfully');
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review');
        }
    };

    const filteredReviews = reviews.filter(review => {
        const query = searchQuery.toLowerCase();
        return (
            review.user?.username?.toLowerCase().includes(query) ||
            review.user?.email?.toLowerCase().includes(query) ||
            review.room?.name?.toLowerCase().includes(query) ||
            review.comment?.toLowerCase().includes(query)
        );
    });

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#F8FAFF]">
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-indigo-50 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Loading Reviews</p>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#F8FAFF] font-sans text-slate-900">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 lg:ml-80 p-4 md:p-12">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden mb-6 p-2 text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                    <FaBars size={24} />
                </button>

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-16 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Guest Reviews</h1>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Management & Moderation</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md mb-10 group">
                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="Search by user, room, or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-600 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300"
                    />
                </div>

                {/* Reviews Grid */}
                {filteredReviews.length === 0 ? (
                    <div className="py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center">
                        <FaStar size={40} className="mx-auto text-slate-200 mb-6" />
                        <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]">No reviews found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between">

                                <div className="space-y-6">
                                    {/* Header: User & Room Info */}
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                                                <FaUserCircle size={24} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-black text-slate-900 text-sm truncate">{review.user?.username || 'Unknown User'}</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{review.user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-2 max-w-full shrink-0">
                                            <FaHotel size={12} className="text-slate-400 shrink-0" />
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider truncate max-w-[200px]">{review.room?.name || 'Unknown Room'}</span>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex text-amber-400 gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} size={16} className={i < review.rating ? 'fill-current' : 'text-slate-100'} />
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Comment */}
                                    <div className="relative pl-6 border-l-2 border-indigo-100 italic text-slate-600 text-sm leading-relaxed">
                                        <FaQuoteLeft className="absolute -left-2.5 -top-2 bg-white text-indigo-300 p-0.5" size={12} />
                                        "{review.comment}"
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Action</span>
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-500 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-rose-500 hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-rose-500/30"
                                    >
                                        <FaTrash size={12} /> Delete Review
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviews;
