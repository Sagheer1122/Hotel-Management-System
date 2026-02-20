import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaHeadset } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { inquiriesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: user?.username || '',
        email: user?.email || '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.username || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.warn('Please login to established contact with our concierge.');
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            await inquiriesAPI.create(formData);
            toast.success('Message transmitted successfully! Our concierge will respond shortly.');
            setFormData({
                name: user?.username || '',
                email: user?.email || '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error('Error sending message:', error);
            let errorMessage = 'Transmission failed. Please try again.';
            if (error.response) {
                errorMessage = error.response?.data?.errors?.join(', ') ||
                    error.response?.data?.error ||
                    `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
            } else {
                errorMessage = error.message || 'Transmission failed. Please try again.';
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050616] text-white selection:bg-indigo-500/30">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative border-b border-white/5 bg-white/[0.02] backdrop-blur-sm mb-8 md:mb-16 px-4 md:px-6">
                <div className="container mx-auto py-12 md:py-24">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4 md:mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                                <FaHeadset size={20} className="md:w-6 md:h-6" />
                            </div>
                            <span className="text-indigo-400 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em]">Monarch Concierge</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 md:mb-8 leading-none">
                            Establish <span className="bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">Contact</span>
                        </h1>
                        <p className="text-sm md:text-xl text-slate-400 font-medium max-w-xl leading-relaxed">
                            Our primary objective is your absolute comfort. Reach out through our secure channels for immediate assistance.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 pb-12 md:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12 max-w-7xl mx-auto">

                    <div className="lg:col-span-1 space-y-4 md:space-y-6">
                        {[
                            {
                                icon: <FaPhone />,
                                title: 'Global Hotline',
                                value: '+92 300 1234567',
                                detail: 'Instant Connect 24/7'
                            },
                            {
                                icon: <FaEnvelope />,
                                title: 'Digital Mailbox',
                                value: 'care@themonarchhotel.com',
                                detail: 'Response within 12h'
                            },
                            {
                                icon: <FaMapMarkerAlt />,
                                title: 'Headquarters',
                                value: 'Gulberg III, Lahore',
                                detail: 'Punjab, Pakistan'
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/[0.03] backdrop-blur-md p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-500 group">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/[0.05] border border-white/10 text-indigo-400 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-2xl mb-4 md:mb-8 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-xl">
                                    {item.icon}
                                </div>
                                <h3 className="text-[8px] md:text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-3">{item.title}</h3>
                                <p className="text-lg md:text-2xl font-black text-white mb-1 md:mb-2 tracking-tight">{item.value}</p>
                                <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest">{item.detail}</p>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white/[0.03] backdrop-blur-xl p-6 md:p-16 rounded-3xl md:rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

                            <h2 className="text-2xl md:text-4xl font-black text-white mb-6 md:mb-10 tracking-tighter">Direct Message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                    <div className="space-y-2 md:space-y-4">
                                        <label className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-0 py-3 md:py-4 bg-transparent border-b border-white/10 focus:border-indigo-500 outline-none transition-all font-bold text-base md:text-xl placeholder:text-white/10 shadow-none ring-0"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 md:space-y-4">
                                        <label className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1">
                                            Vault Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-0 py-3 md:py-4 bg-transparent border-b border-white/10 focus:border-indigo-500 outline-none transition-all font-bold text-base md:text-xl placeholder:text-white/10 shadow-none ring-0"
                                            placeholder="Email address"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:space-y-4">
                                    <label className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1">
                                        Subject Context
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-0 py-3 md:py-4 bg-transparent border-b border-white/10 focus:border-indigo-500 outline-none transition-all font-bold text-base md:text-xl placeholder:text-white/10 shadow-none ring-0"
                                        placeholder="Brief summary of inquiry"
                                        required
                                    />
                                </div>

                                <div className="space-y-2 md:space-y-4">
                                    <label className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1">
                                        Deep Detail
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-0 py-3 md:py-4 bg-transparent border-b border-white/10 focus:border-indigo-500 outline-none transition-all resize-none font-medium text-base md:text-lg placeholder:text-white/10 h-24 md:h-32 shadow-none ring-0"
                                        placeholder="Compose your message..."
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="relative group w-full py-4 md:py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all shadow-xl md:shadow-2xl shadow-indigo-600/30 active:scale-[0.98] overflow-hidden flex items-center justify-center gap-4 md:gap-6"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                    {loading ? (
                                        'Transmitting...'
                                    ) : (
                                        <span className="flex items-center gap-3 md:gap-4">
                                            Send to Concierge
                                            <FaPaperPlane className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
