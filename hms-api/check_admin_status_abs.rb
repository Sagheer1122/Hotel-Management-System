require_relative 'config/environment'
path = 'c:/Users/Tech Mehal/OneDrive/Desktop/note/HMS/hms-api/db_status_absolute.txt'
File.open(path, 'w') do |f|
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
