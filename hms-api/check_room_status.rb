require_relative 'config/environment'
puts "--- Rooms ---"
Room.all.each do |r|
  puts "Room: #{r.name}, Status: #{r.status}"
end
puts "--- Bookings ---"
Booking.all.each do |b|
  puts "Booking ID: #{b.id}, Room: #{b.room&.name}, Status: #{b.status}"
end
