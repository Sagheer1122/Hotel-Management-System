import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaArrowRight, FaHotel, FaArrowLeft } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                toast.success('Welcome back to The Monarch Hotel!');
                if (result.user.role === 'admin' || result.user.role === 1) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                toast.error(result.error || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050616] p-4 relative overflow-hidden">
            {/* Ambient Background - Responsive sizes */}
            <div className="absolute top-[-10%] right-[-10%] w-[70%] md:w-[40%] h-[40%] bg-indigo-600/20 blur-[100px] md:blur-[120px] rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[70%] md:w-[40%] h-[40%] bg-purple-600/20 blur-[100px] md:blur-[120px] rounded-full animate-pulse-slow delay-1000"></div>

            <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in relative z-10">

                {/* Visual Side (Top on Mobile, Left on Desktop) */}
                <div className="md:w-1/2 p-8 md:p-12 bg-indigo-600 relative overflow-hidden flex flex-col justify-between items-start text-white min-h-[140px] md:min-h-full">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <img
                            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
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
                        <h2 className="text-xl md:text-4xl font-black leading-tight mb-2 md:mb-4 tracking-tight">Your gateway to <br />seamless luxury.</h2>
                        <p className="text-indigo-100 font-medium opacity-80 max-w-xs text-xs md:text-base">Access your personalized concierge dashboard and manage your premier property experiences.</p>
                    </div>

                    <div className="relative z-10 pt-4 md:pt-12 hidden md:block">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 opacity-60">Trusted by thousands of guests</p>
                    </div>
                </div>

                {/* Content Side (Bottom on Mobile, Right on Desktop) */}
                <div className="md:w-1/2 p-6 md:p-12 lg:p-16 flex flex-col justify-center bg-transparent">
                    <div className="mb-8 md:mb-10 text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-2">Welcome Back</h3>
                        <p className="text-slate-400 font-medium text-sm md:text-base">Please enter your credentials to login.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white/[0.05] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all placeholder:text-slate-600 text-sm md:text-base shadow-inner"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-2">
                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Password</label>
                                <Link to="/forgot-password" text-size={14} className="text-[10px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white/[0.05] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all placeholder:text-slate-600 text-sm md:text-base shadow-inner"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-[0.98] flex items-center justify-center gap-3 group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl"></div>
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin z-10"></div>
                            ) : (
                                <span className="flex items-center gap-2 z-10">
                                    Secure Access <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 md:mt-12 text-center">
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-4">New here?</p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-95"
                        >
                            Create Concierge Account
                        </Link>
                    </div>
                </div>
            </div>

            {/* Desktop Only Back Button - Redundant on mobile due to logo link */}
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

export default Login;
