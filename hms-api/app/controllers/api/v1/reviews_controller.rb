class Api::V1::ReviewsController < ApplicationController
  before_action :set_review, only: %i[ update destroy ]
  before_action :set_room, only: %i[ create ]

  def index
    if params[:room_id].present?
      @room = Room.find(params[:room_id])
      @reviews = @room.reviews.includes(:user)
    else
      @reviews = Review.includes(:user, :room).all.order(created_at: :desc)
    end
    render json: @reviews.as_json(include: [:user, :room])
  end

  def user_index
    @reviews = Review.where(user_id: params[:user_id]).includes(:room)
    render json: @reviews.as_json(include: :room)
  end

  def create
    @review = @room.reviews.new(review_params)

    if @review.save
      render json: @review.as_json(include: :user), status: :created
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def update
    if @review.update(review_params)
      render json: @review.as_json(include: :user)
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  private

  def set_review
    @review = Review.find(params[:id])
  end

  def set_room
    @room = Room.find(params[:room_id])
  end

  def review_params
    params.require(:review).permit(:user_id, :rating, :comment)
  end
end
