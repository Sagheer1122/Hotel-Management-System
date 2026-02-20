class Api::V1::AuthController < ApplicationController

  def login
    email = params[:email].to_s.downcase.strip
    user = User.where("LOWER(email) = ?", email).first

    if user&.authenticate(params[:password])
      token = encode_token({ user_id: user.id })
      render json: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status,
          avatar_url: user.avatar_url
        },
        token: token
      }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def forgot_password

    email = params[:email].to_s.downcase.strip
    user = User.where("LOWER(email) = ?", email).first
    
    if user
      reset_token = SecureRandom.random_number(100000..999999).to_s
      
      user.reset_password_token = reset_token
      user.reset_password_sent_at = Time.now
      
      if user.save(validate: false)
        user.reload
        if user.reset_password_token == reset_token
          # Send the actual email
          begin
            UserMailer.reset_password_email(user, reset_token).deliver_now
            Rails.logger.info "DEBUG: Successfully sent reset email with token #{reset_token} to #{user.email}"
          rescue => e
            Rails.logger.error "MAILER ERROR: Failed to send email: #{e.message}"
            Rails.logger.error e.backtrace.join("\n")
          end
          
          render json: { message: 'Password reset instructions have been sent to your email.' }, status: :ok
        else
          Rails.logger.error "DEBUG: Token mismatch! Expected #{reset_token}, got #{user.reset_password_token}"
          render json: { error: "Storage verification failed" }, status: :internal_server_error
        end
      else
        Rails.logger.error "DEBUG: User save failed: #{user.errors.full_messages.join(', ')}"
        render json: { error: "Failed to save reset token: #{user.errors.full_messages.join(', ')}" }, status: :internal_server_error
      end
    else
      render json: { error: 'Email address not found' }, status: :not_found
    end
  end

  def reset_password
    email = params[:email].to_s.downcase.strip
    token = params[:token].to_s.strip
    
    Rails.logger.info "DEBUG: Reset attempt for #{email} with token '#{token}'"
    
    user = User.where("LOWER(email) = ?", email).where(reset_password_token: token).first
    
    if user
      if user.reset_password_sent_at && user.reset_password_sent_at > 2.hours.ago
        if user.update(password: params[:password])
          user.update_columns(reset_password_token: nil, reset_password_sent_at: nil)
          render json: { message: 'Password has been reset successfully' }, status: :ok
        else
          render json: { error: user.errors.full_messages.join(', ') }, status: :unprocessable_entity
        end
      else
        render json: { error: 'Reset token has expired' }, status: :unauthorized
      end
    else
      
      user_by_email = User.where("LOWER(email) = ?", email).first
      db_token = user_by_email ? user_by_email.reset_password_token : "N/A"
      debug_msg = user_by_email ? "Token mismatch. DB has: '#{db_token}', Received: '#{token}'" : "User not found"
      Rails.logger.info "DEBUG: #{debug_msg}"
      
      render json: { error: "Invalid reset token. DB has '#{db_token}' but you entered '#{token}'" }, status: :unauthorized
    end
  end

  private

  def encode_token(payload)
    JWT.encode(payload, Rails.application.secret_key_base)
  end
end
