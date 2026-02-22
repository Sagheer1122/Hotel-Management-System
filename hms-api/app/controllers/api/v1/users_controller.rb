class Api::V1::UsersController < ApplicationController
  before_action :set_user, only: %i[ show update destroy ]

  
  def index
    @users = User.all
    render json: @users, methods: :avatar_url
  end

  def show
    render json: {
      id: @user.id,
      username: @user.username,
      email: @user.email,
      role: @user.role,
      status: @user.status,
      avatar_url: @user.avatar_url
    }
  end

  def create
    @user = User.new(user_params)

    if @user.save
      token = encode_token({ user_id: @user.id })
      render json: {
        user: {
          id: @user.id,
          username: @user.username,
          email: @user.email,
          role: @user.role,
          status: @user.status,
          avatar_url: @user.avatar_url
        },
        token: token
      }, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    has_avatar = params[:user] && params[:user][:avatar].present?
    Rails.logger.info "DEBUG: Updating user #{@user.id}. Avatar present? #{has_avatar}"
    Rails.logger.info "DEBUG: Raw params: #{params.inspect}"
    
    if params[:user] && params[:user][:password].present? && params[:user][:current_password].present?
      unless @user.authenticate(params[:user][:current_password])
        render json: { error: 'Current password is incorrect' }, status: :unauthorized
        return
      end
    end

    begin
      if @user.update(user_update_params)
        Rails.logger.info "DEBUG: User updated successfully. Avatar attached? #{@user.avatar.attached?}"
        render json: {
          id: @user.id,
          username: @user.username,
          email: @user.email,
          role: @user.role,
          status: @user.status,
          avatar_url: @user.avatar_url
        }
      else
        Rails.logger.error "DEBUG: User update failed: #{@user.errors.full_messages}"
        render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    rescue => e
      Rails.logger.error "DEBUG: Exception during update: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: e.message }, status: :internal_server_error
    end
  end

  def destroy
    @user.destroy
    head :no_content
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation, :role, :status, :avatar)
  end

  def user_update_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation, :role, :status, :avatar)
  end

  def encode_token(payload)
    JWT.encode(payload, Rails.application.secret_key_base)
  end
end
