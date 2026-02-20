import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaHotel, FaArrowLeft } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.password_confirmation) {
            toast.error('Passwords do not match!');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters!');
            return;
        }

        setLoading(true);

        const result = await register(formData);

        if (result.success) {
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } else {
            const errorMsg = typeof result.error === 'object'
                ? Object.values(result.error).flat().join(', ')
                : result.error;
            toast.error(errorMsg || 'Registration failed');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050616] p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[70%] md:w-[40%] h-[40%] bg-indigo-600/20 blur-[100px] md:blur-[120px] rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[70%] md:w-[40%] h-[40%] bg-purple-600/20 blur-[100px] md:blur-[120px] rounded-full animate-pulse-slow delay-1000"></div>

            <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in relative z-10">

                {/* Visual Side (Top on Mobile, Left on Desktop) */}
                <div className="md:w-1/2 p-8 md:p-12 bg-indigo-600 relative overflow-hidden flex flex-col justify-between items-start text-white min-h-[140px] md:min-h-full">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <img
                            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80"
                            className="w-full h-full object-cover scale-105"
                            alt="Luxury Hotel"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700/90 to-indigo-900/90"></div>

                    <div className="relative z-10 w-full">
                        <Link to="/" className="flex items-center gap-3 group w-fit">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all shadow-inner border border-white/10">
                                <FaHotel className="text-white" size={20} />
                            </div>
                            <span className="text-lg md:text-2xl font-black tracking-tighter uppercase whitespace-nowrap">The Monarch <span className="text-indigo-300">Hotel</span></span>
                        </Link>
                    </div>

                    <div className="relative z-10 mt-6 md:mt-0 hidden md:block">
                        <h2 className="text-2xl md:text-4xl font-black leading-tight mb-2 md:mb-4 tracking-tight">Experience <br /><span className="text-indigo-200">Pure Luxury</span></h2>
                        <p className="text-indigo-100 font-medium opacity-80 max-w-xs text-xs md:text-base">Create an account to unlock exclusive benefits, personalized stays, and seamless management.</p>
                    </div>

                    <div className="relative z-10 pt-4 md:pt-12 hidden md:block">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 opacity-60">Join Our Community</p>
                    </div>
                </div>

                {/* Content Side (Bottom on Mobile, Right on Desktop) */}
                <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-transparent">
                    <div className="mb-8 text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-2">Create Account</h3>
                        <p className="text-slate-400 font-medium text-sm md:text-base">Join us and start managing with elegance.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Username</label>
                            <div className="relative group">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white/[0.05] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all placeholder:text-slate-600 text-sm md:text-base shadow-inner"
                                    placeholder="Choose a username"
                                    required
                                    minLength={3}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white/[0.05] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all placeholder:text-slate-600 text-sm md:text-base shadow-inner"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Password</label>
                                <div className="relative group">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white/[0.05] border border-white/10 rounded-xl text-white font-bold outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all placeholder:text-slate-600 text-sm md:text-base shadow-inner"
                                        placeholder="Min 6 chars"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Confirm</label>
                                <div className="relative group">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white/[0.05] border border-white/10 rounded-xl text-white font-bold outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all placeholder:text-slate-600 text-sm md:text-base shadow-inner"
                                        placeholder="Confirm Info"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden mt-4"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl"></div>
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin z-10"></div>
                            ) : (
                                <span className="flex items-center gap-2 z-10">
                                    Create Account <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 md:mt-10 text-center">
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-4">Already have an account?</p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-95"
                        >
                            Log In Here
                        </Link>
                    </div>
                </div>
            </div>

            {/* Desktop Only Back Button */}
            <Link
                to="/"
                className="hidden md:flex fixed bottom-8 right-8 w-12 h-12 bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-full items-center justify-center text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all group z-50 shadow-2xl"
                title="Back to Home"
            >
                <FaArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
        </div>
    );
};

export default Register;
