import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaStar, FaArrowRight, FaCalendarAlt, FaUserFriends, FaGem } from 'react-icons/fa';
import { toast } from 'react-toastify';

const RoomList = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/api/v1/rooms');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                const roomsData = Array.isArray(data) ? data : [];
                setRooms(roomsData);
                setFilteredRooms(roomsData);
            } catch (error) {
                console.error('Error fetching rooms:', error);
                toast.error('Unable to reach services.');
                setRooms([]);
                setFilteredRooms([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    useEffect(() => {
        if (!Array.isArray(rooms)) return;
        let result = [...rooms];
        if (selectedCategory && selectedCategory !== 'all') {
            result = result.filter(room => room?.category === selectedCategory);
        }
        if (searchQuery && searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(room =>
                String(room?.name || '').toLowerCase().includes(query) ||
                String(room?.category || '').toLowerCase().replace(/_/g, ' ').includes(query)
            );
        }
        if (showAvailableOnly) {
            result = result.filter(room => room?.status === 'available' || room?.status === 0);
        }
        setFilteredRooms(result);
    }, [selectedCategory, searchQuery, rooms, showAvailableOnly]);

    const getRoomImage = (room) => {
        // Use backend image ONLY if it's a valid, non-placeholder URL
        if (room?.image && room.image.startsWith('http') && !room.image.includes('placeholder')) {
            return room.image;
        }

        const fallbacks = {
            single: [
                'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1631049307208-950375b617ef?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800'
            ],
            couple: [
                'https://images.unsplash.com/photo-1590490360182-c33d59735310?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1591088398332-8a77d399e875?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
            ],
            family: [
                'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=800'
            ],
            suite: [
                'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1578683010236-d716f9759678?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1591088398332-8a77d399e875?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1556784344-964228965f3d?auto=format&fit=crop&q=80&w=800'
            ]
        };

        const cat = String(room?.category || '').toLowerCase();
        let list = fallbacks.single;
        if (cat.includes('couple') || cat.includes('double')) list = fallbacks.couple;
        else if (cat.includes('family')) list = fallbacks.family;
        else if (cat.includes('presidential') || cat.includes('suite') || cat.includes('elite')) list = fallbacks.suite;

        const id = parseInt(room?.id) || 0;
        const index = id % list.length;
        return list[index];
    };

    const categories = [
        { key: 'all', label: 'All Suites', icon: '💎' },
        { key: 'single_room', label: 'Single', icon: '👤' },
        { key: 'couple_room', label: 'Couple', icon: '❤️' },
        { key: 'family_room', label: 'Family', icon: '🏠' },
        { key: 'presidential_room', label: 'Presidential', icon: '👑' }
    ];

    const featuredRooms = Array.isArray(rooms) ? rooms.filter(room => room?.isPopular).slice(0, 4) : [];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative py-20 md:py-32 lg:h-[450px] w-full flex items-center justify-center bg-slate-900 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1600"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                    alt="Luxury Hotel"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>

                <div className="relative z-10 container mx-auto px-6 text-center text-white">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">
                        The Monarch Collection
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 md:mb-6">
                        Discover Your <span className="text-indigo-400">Perfect Stay</span>
                    </h1>
                    <p className="text-sm md:text-lg text-slate-200 mb-8 md:mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Experience the epitome of luxury with our curated selection of rooms and suites, designed for unparalleled comfort.
                    </p>

                    <div className="max-w-4xl mx-auto bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-2xl flex flex-col md:flex-row items-center gap-3 md:gap-4 animate-fade-in-up">
                        <div className="flex-1 w-full px-2 md:px-4 flex items-center gap-3">
                            <FaSearch className="text-indigo-400 text-lg" />
                            <input
                                type="text"
                                placeholder="Search by name, type or feel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-3 md:py-4 text-slate-800 outline-none font-bold placeholder:text-slate-400 placeholder:font-medium bg-transparent"
                            />
                        </div>
                        <button className="w-full md:w-auto px-8 md:px-10 py-3 md:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/30 active:scale-95">
                            Find Room
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                {/* Categories Filter */}
                <div className="flex overflow-x-auto pb-6 gap-3 md:gap-4 mb-8 md:mb-12 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setSelectedCategory(cat.key)}
                            className={`flex-none flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold whitespace-nowrap transition-all border text-xs md:text-sm uppercase tracking-wider ${selectedCategory === cat.key
                                ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20'
                                : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200 hover:text-indigo-600'
                                }`}
                        >
                            <span className="text-base md:text-lg">{cat.icon}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Our Room Collection</h2>
                        <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border border-indigo-100">
                            {filteredRooms.length} Matches Found
                        </div>
                    </div>

                    <button
                        onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${showAvailableOnly
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600'
                            }`}
                    >
                        <span className={`w-2 h-2 rounded-full ${showAvailableOnly ? 'bg-white animate-pulse' : 'bg-emerald-500'}`}></span>
                        {showAvailableOnly ? 'Showing Available Only' : 'Show Available Only'}
                    </button>
                </div>

                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Collection...</p>
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="py-24 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm mx-4 md:mx-0">
                        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-6">
                            <FaSearch size={32} />
                        </div>
                        <p className="text-slate-900 font-bold text-lg mb-2">No rooms found</p>
                        <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">We couldn't find any rooms matching your current criteria. Try adjusting your filters.</p>
                        <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {filteredRooms.map((room) => (
                            <div key={room.id} className="group bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1">
                                <div className="h-64 relative overflow-hidden">
                                    <img
                                        src={getRoomImage(room)}
                                        alt={room.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/20">
                                        <span className="font-black text-slate-900 text-sm">Rs.{room.price}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">/ Night</span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <div className="flex items-center gap-1 text-yellow-400 mb-1">
                                            <FaStar size={10} />
                                            <span className="text-xs font-bold text-white">{room.rating || 'New'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8">
                                    <div className="mb-4">
                                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full mb-3 inline-block">
                                            {room.category?.replace(/_/g, ' ') || 'Luxury'}
                                        </span>
                                        <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                                            {room.name}
                                        </h3>
                                        <p className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                                            <FaUserFriends className="text-indigo-400" size={12} />
                                            <span>Max {room.capacity} Guests</span>
                                        </p>
                                        <div className="mt-3">
                                            {(room.status === 'available' || room.status === 0) ? (
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                                    ● Available
                                                </span>
                                            ) : (room.status === 'booked' || room.status === 1) ? (
                                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                                    ● Occupied
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                                                    ● Unavailable
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-50">
                                        <button
                                            onClick={() => navigate(`/rooms/${room.id}`)}
                                            className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group/btn"
                                        >
                                            View Details
                                            <FaArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {featuredRooms.length > 0 && (
                    <div className="mt-24 md:mt-32 mb-12">
                        <div className="flex items-center gap-4 mb-8 md:mb-12">
                            <div className="h-px flex-1 bg-slate-200"></div>
                            <span className="text-slate-300 font-black text-xs uppercase tracking-[0.3em]">Featured Collections</span>
                            <div className="h-px flex-1 bg-slate-200"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {featuredRooms.map(room => (
                                <div key={room.id} onClick={() => navigate(`/rooms/${room.id}`)} className="cursor-pointer group relative aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                    <img src={getRoomImage(room)} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                    <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">{room.category?.replace(/_/g, ' ')}</p>
                                        <p className="font-black text-lg leading-tight mb-2">{room.name}</p>
                                        <div className="w-8 h-1 bg-indigo-500 rounded-full group-hover:w-16 transition-all duration-500"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default RoomList;
