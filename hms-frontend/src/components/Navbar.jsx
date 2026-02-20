import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHotel, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success('Successfully logged out!');
        navigate('/');
        setIsMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Rooms', path: '/rooms' },
        { name: 'About', path: '/about' },
        { name: 'Bookings', path: '/bookings', protected: true },
        { name: 'Contact', path: '/contact' }
    ].filter(link => !link.protected || isAuthenticated);

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 sticky top-0 z-[100]">
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-lg sm:shadow-xl shadow-indigo-600/20 group-hover:rotate-12 transition-transform duration-500">
                        <FaHotel className="text-sm sm:text-xl" />
                    </div>
                    <span className="text-sm sm:text-lg font-black text-slate-800 tracking-tighter uppercase transition-colors group-hover:text-indigo-600">
                        The Monarch <span className="text-indigo-600">Hotel</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex gap-8 items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-slate-600 hover:text-indigo-600 text-sm font-semibold transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="flex gap-4 items-center">
                    {isAuthenticated ? (
                        <>
                            <Link to={user?.role === 'admin' || user?.role === 1 ? '/admin/dashboard' : '/dashboard'} className="hidden md:block text-slate-700 hover:text-indigo-600 font-bold text-sm transition-colors">
                                Dashboard
                            </Link>
                            <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                                <Link to="/profile" className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 hover:border-indigo-500 transition-all">
                                    <img
                                        src={user?.avatar_url ? (user.avatar_url.startsWith('http') ? user.avatar_url : `http://localhost:3000${user.avatar_url}`) : `https://ui-avatars.com/api/?name=${user?.username}&background=4f46e5&color=fff&bold=true`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                                <div className="hidden sm:flex flex-col">
                                    <span className="text-sm font-bold text-slate-800 leading-none">{user?.username}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                        {user?.role === 'admin' || user?.role === 1 ? 'Admin' : 'Guest'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="hidden sm:block text-slate-500 hover:text-red-500 font-bold text-xs uppercase tracking-wider transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                            <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-bold text-sm transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95">
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[80vh] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'} [&::-webkit-scrollbar]:hidden`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-3 rounded-lg text-base font-semibold transition-all"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {isAuthenticated && (
                        <Link
                            to={user?.role === 'admin' || user?.role === 1 ? '/admin/dashboard' : '/dashboard'}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-3 rounded-lg text-base font-semibold transition-all"
                        >
                            Dashboard
                        </Link>
                    )}

                    {!isAuthenticated && (
                        <div className="md:hidden flex flex-col gap-3 pt-4 border-t border-gray-100 mt-2">
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full text-center text-slate-600 hover:text-indigo-600 font-bold py-3 rounded-lg border border-slate-200 hover:border-indigo-600 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {isAuthenticated && (
                        <button
                            onClick={handleLogout}
                            className="w-full text-left text-red-500 hover:bg-red-50 px-4 py-3 rounded-lg text-base font-semibold transition-all"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
