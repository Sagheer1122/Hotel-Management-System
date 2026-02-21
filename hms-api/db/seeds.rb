# Seed users if none exist
if User.count == 0
  puts "Creating users..."
  admin = User.create!(
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin12',
    password_confirmation: 'admin12',
    role: 'admin'
  )

  user = User.create!(
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password',
    password_confirmation: 'password',
    role: 'user'
  )
end

# Seed rooms if none exist
if Room.count == 0
  puts "Creating rooms..."
  rooms_data = [
    {
      name: 'Single Room',
      description: 'A cozy room perfect for solo travelers, featuring a comfortable single bed and modern amenities for a relaxing stay.',
      price: 7000,
      category: 'single_room',
      capacity: 2,
      status: 'available',
      is_featured: false
    },
    {
      name: 'Couple Room',
      description: 'Designed for couples, this room offers a romantic atmosphere with a queen-sized bed and beautiful city views.',
      price: 15000,
      category: 'couple_room',
      capacity: 2,
      status: 'available',
      is_featured: true
    },
    {
      name: 'Family Room',
      description: 'Spacious accommodation for the whole family, with multiple beds, a sitting area, and kid-friendly amenities.',
      price: 30000,
      category: 'family_room',
      capacity: 4,
      status: 'available',
      is_featured: false
    },
    {
      name: 'Presidential Suite',
      description: 'The ultimate luxury experience with a private terrace, jacuzzi, king-sized bed, and premium service.',
      price: 50000,
      category: 'presidential_room',
      capacity: 6,
      status: 'available',
      is_featured: true
    },
    {
      name: 'Deluxe Single',
      description: 'Premium single room with upgraded amenities and a great view.',
      price: 7000,
      category: 'single_room',
      capacity: 1,
      status: 'available',
      is_featured: false
    },
    {
      name: 'Honeymoon Suite',
      description: 'Perfect for newlyweds with romantic decor and special amenities.',
      price: 15000,
      category: 'couple_room',
      capacity: 2,
      status: 'available',
      is_featured: true
    },
    {
      name: 'Family Deluxe',
      description: 'Extra large family room with connecting bedrooms.',
      price: 30000,
      category: 'family_room',
      capacity: 6,
      status: 'available',
      is_featured: false
    },
    {
      name: 'Royal Suite',
      description: 'Ultimate luxury with butler service and exclusive amenities.',
      price: 50000,
      category: 'presidential_room',
      capacity: 8,
      status: 'available',
      is_featured: true
    },
    {
      name: 'Ocean View Single',
      description: 'Beautiful single room with ocean view and balcony.',
      price: 7000,
      category: 'single_room',
      capacity: 1,
      status: 'available',
      is_featured: false
    },
    {
      name: 'Garden Suite',
      description: 'Peaceful couple room overlooking our beautiful gardens.',
      price: 15000,
      category: 'couple_room',
      capacity: 2,
      status: 'available',
      is_featured: false
    },
    {
      name: 'Executive Family',
      description: 'Spacious family room with separate living area.',
      price: 30000,
      category: 'family_room',
      capacity: 5,
      status: 'available',
      is_featured: true
    },
    {
      name: 'Penthouse Suite',
      description: 'Top floor luxury with panoramic city views.',
      price: 50000,
      category: 'presidential_room',
      capacity: 8,
      status: 'available',
      is_featured: true
    },
    {
      name: 'Cozy Single',
      description: 'Affordable comfort for budget-conscious travelers.',
      price: 7000,
      category: 'single_room',
      capacity: 1,
      status: 'available',
      is_featured: false
    },
    {
      name: 'Romantic Couple',
      description: 'Perfect for couples with jacuzzi and fireplace.',
      price: 15000,
      category: 'couple_room',
      capacity: 2,
      status: 'available',
      is_featured: true
    },
    {
      name: 'Family Paradise',
      description: 'Kids-friendly room with bunk beds and play area.',
      price: 30000,
      category: 'family_room',
      capacity: 6,
      status: 'available',
      is_featured: false
    },
    {
      name: 'Grand Presidential',
      description: 'Ultimate luxury with private pool and butler.',
      price: 50000,
      category: 'presidential_room',
      capacity: 10,
      status: 'available',
      is_featured: true
    },
    {
      name: 'Business Single',
      description: 'Work-friendly room with desk and high-speed WiFi.',
      price: 7000,
      category: 'single_room',
      capacity: 1,
      status: 'available',
      is_featured: false
    },
    {
      name: 'Sunset Couple',
      description: 'Couples room with stunning sunset views.',
      price: 15000,
      category: 'couple_room',
      capacity: 2,
      status: 'available',
      is_featured: false
    },
    {
      name: 'Adventure Family',
      description: 'Family room with gaming console and entertainment.',
      price: 30000,
      category: 'family_room',
      capacity: 5,
      status: 'available',
      is_featured: false
    },
    {
      name: 'Royal Presidential',
      description: 'Palatial suite with grand piano and art collection.',
      price: 50000,
      category: 'presidential_room',
      capacity: 12,
      status: 'available',
      is_featured: true
    }
  ]

  rooms_data.each do |room_data|
    Room.create!(room_data)
    puts "Created room: #{room_data[:name]}"
  end
end

puts "Seeding complete!"
puts "Current stats: #{User.count} users and #{Room.count} rooms"
