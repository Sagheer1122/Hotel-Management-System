class User < ApplicationRecord
  has_secure_password
  
  has_many :bookings, dependent: :destroy
  has_many :reviews, dependent: :destroy

  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 20 }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 6, maximum: 20 }, if: -> { new_record? || !password.nil? }

  enum :role, { user: 0, admin: 1 }
  enum :status, { active: 0, blocked: 1, verified: 2 }

  has_one_attached :avatar

  before_create :set_default_role

  def avatar_url
    return nil unless avatar.attached?

    begin
      # Generate the full URL for the avatar
      Rails.application.routes.url_helpers.rails_blob_url(avatar, only_path: false)
    rescue => e
      nil
    end
  end

  private

  def set_default_role
    self.role ||= :user
    self.status ||= :active
  end
end
