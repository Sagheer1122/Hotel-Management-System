class Room < ApplicationRecord
  has_many :bookings, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many_attached :images

  validates :name, presence: true, uniqueness: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 7000, less_than_or_equal_to: 50000 }
  validates :capacity, presence: true, numericality: { greater_than: 0 }

  enum :category, { single_room: 0, couple_room: 1, family_room: 2, presidential_room: 3 }
  enum :status, { available: 0, booked: 1, unavailable: 2 }

  scope :featured, -> { where(is_featured: true) }
  scope :available, -> { where(status: :available) }

  include Rails.application.routes.url_helpers

  def as_json(options = {})
    # Use global default_url_options instead of hardcoded host
    image_url = nil
    if images.attached?
      begin
        image_url = rails_blob_url(images.first, only_path: false)
      rescue
        image_url = nil
      end
    end

    super(options).merge(
      image: image_url,
      rating: reviews.average(:rating).to_f.round(1)
    )
  end
end
