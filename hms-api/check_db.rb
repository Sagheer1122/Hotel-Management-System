require_relative 'config/environment'
begin
  users = User.pluck(:id, :username, :email)
  puts users.inspect
rescue => e
  puts "ERROR: #{e.message}"
end
