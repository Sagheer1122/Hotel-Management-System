import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FaHotel,
    FaUsers,
    FaBed,
    FaCalendarAlt,
    FaEnvelope,
    FaChartLine,
    FaHome,
    FaCreditCard,
    FaStar,
    FaSignOutAlt,
    FaCompass
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/admin/dashboard', icon: <FaChartLine />, label: 'Overview' },
        { path: '/admin/rooms', icon: <FaBed />, label: 'Rooms' },
        { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
        { path: '/admin/bookings', icon: <FaCalendarAlt />, label: 'Bookings' },
        { path: '/admin/payments', icon: <FaCreditCard />, label: 'Payments' },
        { path: '/admin/inquiries', icon: <FaEnvelope />, label: 'Inquiries' },
        { path: '/admin/reviews', icon: <FaStar />, label: 'Reviews' },
    ];

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    return (
        <aside className="w-80 bg-[#0A0C1F] flex flex-col fixed h-screen z-40 border-r border-white/5 shadow-2xl overflow-hidden">
            {/* Logo Section */}
            <div className="p-8 mb-4">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-indigo-600 rounded-[18px] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <FaHotel size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
                            MONARCH<span className="text-indigo-500">.</span>
                        </h1>
                        <p className="text-[9px] font-black text-indigo-500/60 uppercase tracking-[0.3em] leading-none mt-1">Admin Portal</p>
                    </div>
                </Link>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <p className="px-6 text-[9px] font-black text-white uppercase tracking-[0.4em] mb-4">Core Management</p>

                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98]'
                                : 'text-white/70 hover:text-white hover:bg-white/[0.03]'
                                }`}
                        >
                            <span className={`text-lg transition-colors ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>}
                        </Link>
                    );
                })}

                <div className="pt-8 opacity-40 hover:opacity-100 transition-all border-t border-white/5 mt-8">
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
        </aside>
    );
};

export default Sidebar;
