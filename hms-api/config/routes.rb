Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post 'auth/login', to: 'auth#login'
      post 'auth/register', to: 'users#create'
      post 'auth/forgot_password', to: 'auth#forgot_password'
      post 'auth/reset_password', to: 'auth#reset_password'
      
      resources :users, only: [:index, :show, :create, :update, :destroy]
      resources :rooms do
        resources :reviews, only: [:create, :index]
        collection do
          get :featured
        end
      end
      resources :bookings, only: [:index, :create, :show, :update, :destroy]
      resources :reviews, only: [:index, :update, :destroy]
      resources :inquiries, only: [:index, :create, :show, :update, :destroy]
      get 'my_reviews', to: 'reviews#user_index'
    end
  end

  # Root route to verify backend is live
  root to: proc { [200, { 'Content-Type' => 'application/json' }, [{ status: 'Monarch HMS API is Live! 🚀', time: Time.now }.to_json]] }

  # Temporary debug endpoint - remove after testing
  get '/debug/db', to: proc { |env|
    users = User.all.map { |u| { id: u.id, email: u.email, role: u.role } }
    [200, { 'Content-Type' => 'application/json' }, [{ users_count: User.count, users: users }.to_json]]
  }
end
