class Api::V1::BookingsController < ApplicationController
  before_action :set_booking, only: %i[ show update destroy ]
  before_action :auto_complete_bookings, only: [:index, :show]

  def index
    @bookings = Booking.includes(:user, :room)
    

    if params[:user_id].present?
      @bookings = @bookings.where(user_id: params[:user_id])
    end
    
    if params[:status].present?
      @bookings = @bookings.where(status: params[:status])
    end
    
    render json: @bookings.as_json(include: { 
      user: { only: [:id, :username, :email, :role, :status], methods: [:avatar_url] },
      room: { only: [:id, :name, :description, :price, :capacity, :category, :status] }
    })
  end

  def show
    render json: @booking.as_json(include: { 
      user: { methods: [:avatar_url] },
      room: {}
    })
  end

  # POST /api/v1/bookings
  def create
    @booking = Booking.new(booking_params)

    if @booking.save
      render json: @booking.as_json(include: { 
        user: { methods: [:avatar_url] },
        room: {}
      }), status: :created
    else
      render json: @booking.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/bookings/1
  def update
    if @booking.update(booking_params)
      render json: @booking.as_json(include: { 
        user: { methods: [:avatar_url] },
        room: {}
      })
    else
      render json: @booking.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/bookings/1
  def destroy
    @booking.destroy
    head :no_content
  end

  private

  def set_booking
    @booking = Booking.find(params[:id])
  end

  def auto_complete_bookings
    Booking.auto_complete_expired_bookings
  end

  def booking_params
    params.require(:booking).permit(:user_id, :room_id, :start_date, :end_date, :status, :total_price, :payment_method, :payment_status)
  end
end
