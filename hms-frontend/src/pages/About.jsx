import React from 'react';
import { FaHotel, FaUsers, FaAward, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="min-h-screen">
            <div className="relative bg-slate-900 text-white py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Luxury Hotel"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-black mb-6 animate-fade-in-up">About The Monarch Hotel</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto animate-fade-in-up delay-100">
                        Redefining luxury hospitality with world-class service and unforgettable experiences.
                    </p>
                </div>
            </div>

            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="Hotel Interior"
                                    className="rounded-2xl shadow-2xl z-10 relative"
                                />
                                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-100 rounded-full -z-0 hidden md:block"></div>
                                <div className="absolute -top-6 -left-6 w-32 h-32 bg-orange-100 rounded-full -z-0 hidden md:block"></div>
                            </div>
                        </div>
                        <div className="md:w-1/2 space-y-6">
                            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Our Story</span>
                            <h2 className="text-4xl font-bold text-slate-800">A Tradition of Excellence Since 2010</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Founded with a vision to provide travelers with a home away from home, The Monarch Hotel has grown into a leading name in luxury hospitality. We believe that every guest deserves more than just a place to sleep—they deserve an experience.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                From our meticulously designed rooms to our award-winning culinary offerings, every detail is crafted to perfection. Our team of dedicated professionals works round the clock to ensure your stay is seamless, comfortable, and truly memorable.
                            </p>
                            <div className="pt-4">
                                <Link to="/contact" className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors shadow-lg">
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="p-6">
                            <FaHotel className="text-4xl mx-auto mb-4 opacity-80" />
                            <h3 className="text-4xl font-black mb-1">10+</h3>
                            <p className="text-blue-200 font-bold">Years of Service</p>
                        </div>
                        <div className="p-6">
                            <FaUsers className="text-4xl mx-auto mb-4 opacity-80" />
                            <h3 className="text-4xl font-black mb-1">50k+</h3>
                            <p className="text-blue-200 font-bold">Happy Guests</p>
                        </div>
                        <div className="p-6">
                            <FaAward className="text-4xl mx-auto mb-4 opacity-80" />
                            <h3 className="text-4xl font-black mb-1">15</h3>
                            <p className="text-blue-200 font-bold">Awards Won</p>
                        </div>
                        <div className="p-6">
                            <FaStar className="text-4xl mx-auto mb-4 opacity-80" />
                            <h3 className="text-4xl font-black mb-1">4.9</h3>
                            <p className="text-blue-200 font-bold">Average Rating</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <span className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2 block">Our Team</span>
                    <h2 className="text-4xl font-bold text-slate-800 mb-16">Meet the Experts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Sagheer Ahmad', role: 'Founder & CEO', img: 'https://ui-avatars.com/api/?name=Sagheer+Ahmad&background=4f46e5&color=fff' },
                            { name: 'Muhammad Shahroz', role: 'Technical Director', img: 'https://ui-avatars.com/api/?name=Muhammad+Shahroz&background=0284c7&color=fff' },
                            { name: 'Ayesha Khan', role: 'Operations Manager', img: 'https://ui-avatars.com/api/?name=Ayesha&background=db2777&color=fff' }
                        ].map((member, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 border-4 border-blue-50">
                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{member.name}</h3>
                                <p className="text-blue-600 font-medium text-sm">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
