import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaLock, FaKey, FaArrowLeft, FaHotel, FaCheckCircle } from 'react-icons/fa';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        if (password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setLoading(true);

        try {
            await authAPI.resetPassword(email, token, password);
            toast.success('Password updated successfully!');
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050616] p-4 relative overflow-hidden font-sans">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-fade-in relative z-10 text-center">
                <div className="mb-8 flex justify-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                        <FaHotel size={32} />
                    </div>
                </div>

                {!success ? (
                    <>
                        <h3 className="text-3xl font-black text-white tracking-tighter mb-3">Set New Password</h3>
                        <p className="text-slate-400 font-medium mb-10">Enter the reset code sent to your email.</p>

                        <form onSubmit={handleSubmit} className="space-y-6 text-left">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Verification Code</label>
                                <div className="relative group">
                                    <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={14} />
                                    <input
                                        type="text"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                                        placeholder="6-digit code"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">New Password</label>
                                <div className="relative group">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={14} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Confirm Password</label>
                                <div className="relative group">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={14} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="animate-fade-in">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6 border border-emerald-500/20">
                            <FaCheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tighter mb-3">All Set!</h3>
                        <p className="text-slate-400 font-medium mb-8">Your password has been changed successfully. Redirecting to login...</p>

                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                        >
                            Log In Now
                        </Link>
                    </div>
                )}

                <div className="mt-8 pt-8 border-t border-white/5">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                        <FaArrowLeft size={10} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
