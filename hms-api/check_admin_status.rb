require_relative 'config/environment'
File.open('db_status.txt', 'w') do |f|
  admin = User.find_by(username: 'admin')
  if admin
    f.puts "Admin: #{admin.username}"
    f.puts "Email: #{admin.email}"
    f.puts "Role: #{admin.role}"
    f.puts "Auth check (admin12): #{admin.authenticate('admin12') ? 'SUCCESS' : 'FAILURE'}"
  else
    f.puts "Admin not found"
  end
end
