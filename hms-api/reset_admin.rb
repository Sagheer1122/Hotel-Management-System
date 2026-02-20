require_relative 'config/environment'
begin
  user = User.find_by(username: 'admin')
  if user
    user.update!(password: 'admin12', password_confirmation: 'admin12')
    puts "Updated admin password"
  else
    User.create!(username: 'admin', email: 'admin@example.com', password: 'admin12', password_confirmation: 'admin12', role: 'admin')
    puts "Created admin user"
  end
rescue => e
  puts "ERROR: #{e.message}"
end
