import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaConciergeBell, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const Home = () => {

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="relative min-h-[85vh] flex items-center overflow-hidden pt-20 md:pt-0">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Luxury Hotel"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"></div>
                </div>

                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="max-w-3xl animate-fade-in pt-4 mx-auto md:mx-0 text-center md:text-left">
                        <span className="inline-block px-3 py-1.5 sm:px-4 mb-4 sm:mb-6 rounded-md bg-indigo-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-lg">
                            Luxury Redefined
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
                            Find Your Perfect <br />
                            <span className="text-indigo-400">Sanctuary</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-slate-100 mb-8 sm:mb-10 max-w-xl mx-auto md:mx-0 font-medium leading-relaxed opacity-95 drop-shadow-md">
                            Discover a world of refined elegance and unparalleled comfort. We provide the finest stays for the modern traveler.
                        </p>
                        <div className="flex flex-col sm:flex-row pb-8 flex-wrap gap-4 justify-center md:justify-start">
                            <Link
                                to="/rooms"
                                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-indigo-500/30 active:scale-95 text-lg"
                            >
                                Explore Rooms
                            </Link>
                            <Link
                                to="/contact"
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold rounded-xl transition-all active:scale-95 text-lg"
                            >
                                Get in Touch
                            </Link>
                        </div>
                    </div>
                </div>
            </div>



            {/* Simple Why Us - Responsive Grid */}
            <div className="py-12 sm:py-16 md:py-20 lg:py-24 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
                        <span className="text-indigo-600 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4 block">The Experience</span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight">Why Choose Stellar</h2>
                        <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed px-4 sm:px-0">
                            Discover the difference of true hospitality. We focus on the details so you can focus on your journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
                        {[
                            { icon: <FaBed />, title: 'Premium Comfort', desc: 'Hand-picked linens and ergonomic design' },
                            { icon: <FaConciergeBell />, title: 'Always Available', desc: 'Our concierge is ready for you 24/7' },
                            { icon: <FaShieldAlt />, title: 'Top Security', desc: 'Your safety is our highest priority' },
                            { icon: <FaCheckCircle />, title: 'Easy Booking', desc: 'Seamless reservation experience' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200 transition-all duration-300">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 text-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">{item.title}</h3>
                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Simple CTA - Responsive Padding */}
            <div className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-8 sm:p-12 md:p-16 lg:p-24 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-indigo-500/10 rounded-full blur-[80px] sm:blur-[100px] -mr-32 sm:-mr-40 md:-mr-48 -mt-32 sm:-mt-40 md:-mt-48"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-indigo-500/10 rounded-full blur-[80px] sm:blur-[100px] -ml-32 sm:-ml-40 md:-ml-48 -mb-32 sm:-mb-40 md:-mb-48"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 sm:mb-6 md:mb-8 tracking-tighter">Ready for Perfection?</h2>
                            <p className="text-indigo-100/70 text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto font-medium px-4 sm:px-0">
                                Join our elite circle of members and experience hospitality like never before.
                            </p>
                            <Link
                                to="/rooms"
                                className="inline-block px-8 sm:px-10 py-4 sm:py-5 bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white font-bold rounded-xl sm:rounded-2xl transition-all shadow-xl hover:shadow-indigo-500/20 text-base sm:text-lg md:text-xl"
                            >
                                Book Your Stay
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Minimalist Stats - Responsive Layout */}
            <div className="py-12 sm:py-16 md:py-20 lg:py-24 bg-slate-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 text-center">
                        {[
                            { val: '150+', lab: 'Luxury Suites' },
                            { val: '24k', lab: 'Happy Guests' },
                            { val: '50+', lab: 'Locations' },
                            { val: '4.9', lab: 'Avg. Rating' }
                        ].map((stat, idx) => (
                            <div key={idx} className="group transition-transform hover:scale-110 duration-300">
                                <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-1 sm:mb-2 tracking-tighter">{stat.val}</h4>
                                <p className="text-indigo-400 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[8px] sm:text-[9px] md:text-[10px]">{stat.lab}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
