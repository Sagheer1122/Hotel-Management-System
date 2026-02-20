import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHotel, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div>
                        <Link to="/" className="flex items-center gap-3 group mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20 group-hover:rotate-12 transition-transform duration-500">
                                <FaHotel size={20} />
                            </div>
                            <span className="text-xl font-black text-white tracking-tighter uppercase">The Monarch <span className="text-blue-600">Hotel</span></span>
                        </Link>
                        <p className="text-gray-400 mb-4 leading-relaxed">
                            Experience luxury and comfort in our premium hotel rooms. Your perfect stay awaits at The Monarch Hotel.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                                <FaFacebook />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors">
                                <FaTwitter />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors">
                                <FaInstagram />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
                            <li><Link to="/rooms" className="hover:text-blue-500 transition-colors">Rooms</Link></li>
                            <li><Link to="/bookings" className="hover:text-blue-500 transition-colors">Bookings</Link></li>
                            <li><Link to="/about" className="hover:text-blue-500 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-500 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Room Categories</h3>
                        <ul className="space-y-2">
                            <li><Link to="/rooms" className="hover:text-blue-500 transition-colors">Single Rooms</Link></li>
                            <li><Link to="/rooms" className="hover:text-blue-500 transition-colors">Couple Rooms</Link></li>
                            <li><Link to="/rooms" className="hover:text-blue-500 transition-colors">Family Rooms</Link></li>
                            <li><Link to="/rooms" className="hover:text-blue-500 transition-colors">Presidential Suites</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                                <span>Gulberg III, Lahore, Punjab, Pakistan</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhone className="text-blue-500 flex-shrink-0" />
                                <span>+92 300 1234567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-blue-500 flex-shrink-0" />
                                <span>care@themonarchhotel.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} The Monarch Hotel. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link to="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link>
                        <Link to="/cookies" className="hover:text-blue-500 transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
