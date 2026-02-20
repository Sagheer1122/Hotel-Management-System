require_relative 'config/environment'
puts "Synchronizing room statuses..."
Room.all.each do |room|
  if room.bookings.where(status: [:pending, :approved]).exists?
    room.update(status: :booked)
    puts "Room #{room.name}: marked as BOOKED"
  else
    room.update(status: :available)
    puts "Room #{room.name}: marked as AVAILABLE"
  end
end
puts "Done!"
