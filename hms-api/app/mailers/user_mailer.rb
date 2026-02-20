class UserMailer < ApplicationMailer
  default from: 'sagheerahmad5767@gmail.com'

  def reset_password_email(user, token)
    @user = user
    @token = token
    @url  = "http://localhost:5173/reset-password?email=#{@user.email}&token=#{@token}"
    mail(to: @user.email, subject: 'Password Reset Instructions - Hotel Management System by Sagheer Ahmad')
  end
end
