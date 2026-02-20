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
end
