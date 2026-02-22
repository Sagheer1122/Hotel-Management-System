class Booking < ApplicationRecord
  belongs_to :user
  belongs_to :room

  validates :start_date, :end_date, presence: true
  validate :end_date_after_start_date
  validate :room_availability, on: :create

  STATUSES = { pending: 0, approved: 1, cancelled: 2, completed: 3 }.freeze
  PAYMENT_STATUSES = %w[pending_payment paid failed refunded].freeze
  PAYMENT_METHODS = %w[pay_at_hotel bank_transfer credit_card].freeze

  enum :status, STATUSES

  validates :payment_status, inclusion: { in: PAYMENT_STATUSES }
  validates :payment_method, inclusion: { in: PAYMENT_METHODS }
  validates :payment_status, :payment_method, presence: true

  before_validation :calculate_total_price
  after_initialize :set_defaults, if: :new_record?
  after_save :update_room_status
  after_destroy :update_room_status

  def update_room_status
    return if room.nil?
    
    # A room is considered 'booked' if it has any pending or approved booking
    if room.bookings.where(status: [:pending, :approved]).exists?
      room.update(status: :booked)
    else
      room.update(status: :available)
    end
  end

  def self.auto_complete_expired_bookings
    where(status: :approved).where('end_date < ?', Time.current).update_all(status: :completed)
  end

  private

  def set_defaults
    self.status ||= :pending
    self.payment_status ||= 'pending_payment'
    self.payment_method ||= 'pay_at_hotel'
  end

  def end_date_after_start_date
    return if end_date.blank? || start_date.blank?

    if end_date < start_date
      errors.add(:end_date, "must be after the start date")
    end
  end

  def room_availability
    return if room.nil? || start_date.blank? || end_date.blank?

    overlapping_bookings = Booking.where(room_id: room.id)
                                  .where.not(status: :cancelled)
                                  .where('start_date < ? AND end_date > ?', end_date, start_date)

    if overlapping_bookings.exists?
      errors.add(:base, "Room is not available for the selected dates")
    end
  end

  def calculate_total_price
    if start_date.present? && end_date.present? && room.present?
      # Calculate duration in days, rounding up if there's any fractional part
      days = ((end_date.to_f - start_date.to_f) / 1.day).ceil
      self.total_price = [days, 1].max * room.price
    end
  end
end
