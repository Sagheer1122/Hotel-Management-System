import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI, bookingsAPI, API_BASE_URL } from '../services/api';
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEdit,
    FaSave,
    FaTimes,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaHotel,
    FaStar,
    FaCamera,
    FaUsers,
    FaChartLine,
    FaHome
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, logout, updateUser, loading: authLoading } = useAuth();

    const getAvatarUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [stats, setStats] = useState({
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalSpent: 0
    });

    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user?.id) {
            fetchUserStats();
        }
    }, [user]);

    const fetchUserStats = async () => {
        try {
            const response = await bookingsAPI.getAll({ user_id: user.id });
            const bookings = response.data;

            setStats({
                totalBookings: bookings.length,
                completedBookings: bookings.filter(b => b.status === 'completed' || b.status === 3).length,
                cancelledBookings: bookings.filter(b => b.status === 'cancelled' || b.status === 2).length,
                totalSpent: bookings
                    .filter(b => b.status === 'completed' || b.status === 3)
                    .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0)
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatarPreview(URL.createObjectURL(file));
        setLoading(true);

        try {
            const data = new FormData();
            data.append('user[avatar]', file);

            const response = await usersAPI.update(user.id, data);

            updateUser(response.data);

            toast.success('Profile picture updated!');
            setAvatarFile(null);
            setAvatarPreview(null);
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error('Failed to upload image');
            setAvatarPreview(null);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await usersAPI.update(user.id, {
                username: formData.username,
                email: formData.email
            });

            updateUser(response.data);

            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await usersAPI.update(user.id, {
                current_password: passwordData.currentPassword,
                password: passwordData.newPassword
            });

            toast.success('Password changed successfully!');
            setIsChangingPassword(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.error || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    <Icon size={18} />
                </div>
                <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label}</p>
                    <h3 className="text-xl font-black text-slate-800">{value}</h3>
                </div>
            </div>
        </div>
    );

    if (authLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <FaUser size={48} className="mx-auto text-slate-200 mb-4" />
                <h2 className="text-xl font-black text-slate-800">Not Logged In</h2>
                <p className="text-slate-500 font-bold text-sm mt-2">Please log in to view your profile.</p>
                <Link to="/login" className="inline-block mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                    Login Now
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-black text-slate-900">My Profile</h1>
                    <p className="text-slate-500 font-bold text-sm mt-1">Manage your account settings and preferences</p>
                </div>

            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

                    <div className="relative flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group">
                            <div className="w-36 h-36 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/30 bg-white">
                                <img
                                    src={avatarPreview || getAvatarUrl(user?.avatar_url) || `https://ui-avatars.com/api/?name=${user?.username}&size=200&background=ffffff&color=2563eb&bold=true`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        if (user?.avatar_url) {
                                            e.target.src = `https://ui-avatars.com/api/?name=${user?.username}&size=200&background=ffffff&color=2563eb&bold=true`;
                                        }
                                    }}
                                />

                                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-1">
                                        <FaCamera size={20} className="text-white" />
                                    </div>
                                    <span className="text-white text-[10px] font-black uppercase tracking-wider">Change</span>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                        disabled={loading}
                                    />
                                </label>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg border-2 border-white pointer-events-none group-hover:scale-0 transition-transform">
                                <FaCamera size={12} />
                            </div>
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-3xl font-black text-white">{user?.username}</h2>
                            <p className="text-blue-100 font-bold text-sm mt-1">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                                    {user?.role === 'admin' || user?.role === 1 ? '👑 Admin' : '🎯 Guest'}
                                </span>
                                <span className="px-3 py-1 bg-emerald-500 rounded-full text-white text-xs font-bold flex items-center gap-1">
                                    <FaCheckCircle size={10} />
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {!(user?.role === 'admin' || user?.role === 1) && (
                    <div className="p-6 bg-slate-50/50">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Booking Statistics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                icon={FaHotel}
                                label="Total Bookings"
                                value={stats.totalBookings}
                                color="bg-gradient-to-br from-blue-600 to-blue-700"
                            />
                            <StatCard
                                icon={FaCheckCircle}
                                label="Completed"
                                value={stats.completedBookings}
                                color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                            />
                            <StatCard
                                icon={FaTimesCircle}
                                label="Cancelled"
                                value={stats.cancelledBookings}
                                color="bg-gradient-to-br from-rose-500 to-rose-600"
                            />
                            <StatCard
                                icon={FaStar}
                                label="Total Spent"
                                value={`Rs. ${stats.totalSpent.toLocaleString()}`}
                                color="bg-gradient-to-br from-amber-500 to-amber-600"
                            />
                        </div>
                    </div>
                )}

                {(user?.role === 'admin' || user?.role === 1) && (
                    <div className="relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -mr-48 -mt-24 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -ml-32 -mb-24 pointer-events-none"></div>

                        <div className="p-8 relative">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                        Executive Control Center
                                    </h3>
                                    <p className="text-slate-500 font-bold text-sm">
                                        System-wide oversight & administrative intelligence
                                    </p>
                                </div>
                                <div className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-orange-500/20 flex items-center gap-3 border border-white/20">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-md">
                                        <FaStar size={18} className="animate-pulse" />
                                    </div>
                                    <div className="text-white">
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-80">Access Tier</p>
                                        <p className="text-sm font-black leading-none">Super Administrator</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
                                        <FaChartLine size={80} className="text-blue-600" />
                                    </div>
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                            <FaChartLine size={20} />
                                        </div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Weekly Growth</p>
                                        <h4 className="text-3xl font-black text-slate-800 mb-2">+12.5%</h4>
                                        <div className="mt-auto pt-4 flex items-center gap-2">
                                            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 w-[72%] rounded-full"></div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500">72% Goal</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl shadow-slate-900/20 flex flex-col justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10 grid grid-cols-2 gap-3">
                                        <Link to="/admin/dashboard" className="p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-center">
                                            <FaHome className="mx-auto mb-2 text-blue-400" size={16} />
                                            <span className="text-[10px] font-black text-white uppercase tracking-tighter">Dash</span>
                                        </Link>
                                        <Link to="/admin/bookings" className="p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-center">
                                            <FaCalendarAlt className="mx-auto mb-2 text-indigo-400" size={16} />
                                            <span className="text-[10px] font-black text-white uppercase tracking-tighter">Book</span>
                                        </Link>
                                        <Link to="/admin/rooms" className="p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-center">
                                            <FaHotel className="mx-auto mb-2 text-emerald-400" size={16} />
                                            <span className="text-[10px] font-black text-white uppercase tracking-tighter">Room</span>
                                        </Link>
                                        <Link to="/admin/users" className="p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-center">
                                            <FaUsers className="mx-auto mb-2 text-amber-400" size={16} />
                                            <span className="text-[10px] font-black text-white uppercase tracking-tighter">User</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-slate-50 to-white rounded-[2rem] p-8 border border-white shadow-inner">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-800">
                                        <FaLock size={18} />
                                    </div>
                                    <div>
                                        <h5 className="font-black text-slate-800 leading-none">Security Awareness</h5>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Account authentication history</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Last Login</p>
                                        <p className="text-sm font-black text-slate-800 tracking-tight">Today, 10:42 AM</p>
                                    </div>
                                    <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Clearance Level</p>
                                        <p className="text-sm font-black text-slate-800 tracking-tight ">L-10 (Unrestricted)</p>
                                    </div>
                                    <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Location</p>
                                        <p className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                            Verified Secure
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                    </div>
                )}

                <div className="p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h3 className="text-lg font-black text-slate-800">Profile Information</h3>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-100 transition-all self-start sm:self-auto"
                            >
                                <FaEdit size={14} /> Edit Details
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        required
                                    />
                                </div>
                            </div>


                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        required
                                    />
                                </div>
                            </div>
                        </div>


                        {isEditing && (
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                >
                                    <FaSave size={14} />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            username: user?.username || '',
                                            email: user?.email || ''
                                        });
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    <FaTimes size={14} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>
                </div>


                <div className="p-8 border-t border-slate-100 bg-slate-50/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-800">Security</h3>
                            <p className="text-slate-500 text-xs font-bold mt-1">Update your password to keep your account secure</p>
                        </div>
                        {!isChangingPassword && (
                            <button
                                onClick={() => setIsChangingPassword(true)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg"
                            >
                                <FaLock size={14} />
                                Change Password
                            </button>
                        )}
                    </div>

                    {isChangingPassword && (
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg disabled:opacity-50"
                                >
                                    <FaSave size={14} />
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsChangingPassword(false);
                                        setPasswordData({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    <FaTimes size={14} />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
