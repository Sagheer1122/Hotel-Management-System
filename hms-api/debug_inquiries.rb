begin
  puts "--- DIAGNOSTIC START ---"
  
  # 1. Check if the route exists
  puts "\n1. Testing Route Recognition for POST /api/v1/inquiries (Contact Form):"
  begin
    route = Rails.application.routes.recognize_path("/api/v1/inquiries", method: :post)
    puts "   SUCCESS: Route found! Maps to: #{route}"
  rescue ActionController::RoutingError => e
    puts "   FAILURE: Route not found. Error: #{e.message}"
  end

  # 2. Check if the route exists for GET (Admin List)
  puts "\n2. Testing Route Recognition for GET /api/v1/inquiries (Admin List):"
  begin
    route = Rails.application.routes.recognize_path("/api/v1/inquiries", method: :get)
    puts "   SUCCESS: Route found! Maps to: #{route}"
  rescue ActionController::RoutingError => e
    puts "   FAILURE: Route not found. Error: #{e.message}"
  end

  # 3. Check if the Controller class can be loaded
  puts "\n3. Testing Controller Loading (Api::V1::InquiriesController):"
  begin
    controller = Api::V1::InquiriesController
    puts "   SUCCESS: Controller class loaded: #{controller}"
    puts "   Methods defined: #{controller.action_methods.to_a}"
  rescue NameError => e
    puts "   FAILURE: Could not load controller class. Error: #{e.message}"
  rescue => e
    puts "   FAILURE: Unknown error loading controller. Error: #{e.message}"
  end

  puts "--- DIAGNOSTIC END ---"
rescue => e
  puts "CRITICAL SCRIPT ERROR: #{e.message}"
  puts e.backtrace
end
