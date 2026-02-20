import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaHotel,
    FaThLarge,
    FaSuitcase,
    FaStar,
    FaUser,
    FaCompass,
    FaHome,
    FaSignOutAlt,
    FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserSidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    const handleItemClick = (id) => {
        setActiveTab(id);
        if (onClose) onClose();
    };

    const SidebarItem = ({ icon: Icon, label, id }) => (
        <button
            onClick={() => handleItemClick(id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all font-black text-[10px] uppercase tracking-widest relative group ${activeTab === id
                ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40 active:scale-[0.98]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
        >
            <Icon size={16} className={activeTab === id ? 'text-white' : 'text-white/40 group-hover:text-white'} />
            <span className="relative z-10">{label}</span>
            {activeTab === id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            )}
        </button>
    );

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed top-0 left-0 h-screen w-80 bg-[#0A0C1F] flex flex-col z-50 border-r border-white/5 shadow-2xl overflow-hidden transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="w-12 h-12 bg-indigo-600 rounded-[18px] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            <FaHotel size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tighter leading-none mb-1 uppercase">MONARCH<span className="text-indigo-500">.</span></h1>
                            <p className="text-[9px] font-black text-indigo-500/60 uppercase tracking-[0.3em]">Guest Portal</p>
                        </div>
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-white/50 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar px-8 pb-4">
                    <p className="px-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">Experience Hub</p>

                    <SidebarItem icon={FaThLarge} label="Dashboard" id="dashboard" />
                    <SidebarItem icon={FaSuitcase} label="My Reservations" id="bookings" />
                    <SidebarItem icon={FaStar} label="My Reviews" id="reviews" />
                    <SidebarItem icon={FaUser} label="My Profile" id="profile" />

                    <div className="pt-10 opacity-40 hover:opacity-100 transition-all border-t border-white/5 mt-8">
                        <p className="px-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Discovery</p>
                        <Link to="/rooms" className="flex items-center gap-4 px-6 py-4 rounded-2xl text-white/70 hover:text-white hover:bg-white/5 transition-all font-black text-[10px] uppercase tracking-widest group">
                            <FaCompass size={16} className="text-white/40 group-hover:text-white" />
                            Explore Rooms
                        </Link>
                        <Link to="/" className="flex items-center gap-4 px-6 py-4 rounded-2xl text-white/70 hover:text-white hover:bg-white/5 transition-all font-black text-[10px] uppercase tracking-widest group">
                            <FaHome size={16} className="text-white/40 group-hover:text-white" />
                            Front Page
                        </Link>
                    </div>
                </nav>

                <div className="p-8 pt-6 border-t border-white/5 mt-auto bg-[#0A0C1F]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 hover:text-white hover:bg-rose-500 transition-all duration-300 font-black text-[10px] uppercase tracking-widest group shadow-lg hover:shadow-rose-500/20"
                    >
                        <FaSignOutAlt size={18} className="group-hover:rotate-12 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default UserSidebar;
