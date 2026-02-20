class AddPaymentDetailsToBookings < ActiveRecord::Migration[8.1]
  def change
    add_column :bookings, :payment_method, :string
    add_column :bookings, :payment_status, :string
  end
end
