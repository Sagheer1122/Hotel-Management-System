import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Profile from '../Profile';
import { FaBars, FaHome, FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');
    const API_BASE_URL = 'https://hotel-management-system-uqxt.onrender.com';

    const getAvatarUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

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
                            <Link to="/" className="text-gray-600 hover:text-blue-600 font-bold text-sm flex items-center gap-2">
                                <FaHome size={16} /> Home
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

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto w-full p-4 md:p-8">
                    <Profile />
                </main>
            </div>
        </div>
    );
};

export default AdminProfile;
