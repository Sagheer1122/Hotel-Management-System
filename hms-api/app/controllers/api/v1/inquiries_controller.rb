module Api
  module V1
    class InquiriesController < ApplicationController
     
      def create
        @inquiry = Inquiry.new(inquiry_params)

        if @inquiry.save
          render json: { status: 'success', message: 'Inquiry sent successfully', data: @inquiry }, status: :created
        else
          render json: { status: 'error', errors: @inquiry.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def index
        @inquiries = Inquiry.all.order(created_at: :desc)
        render json: { status: 'success', data: @inquiries }
      end

      def update
        @inquiry = Inquiry.find(params[:id])
        if @inquiry.update(inquiry_params)
          render json: { status: 'success', data: @inquiry }
        else
          render json: { status: 'error', errors: @inquiry.errors.full_messages }, status: :unprocessable_entity
        end
      end

      
      def destroy
        @inquiry = Inquiry.find(params[:id])
        @inquiry.destroy
        render json: { status: 'success', message: 'Inquiry deleted successfully' }
      end

      private

      def inquiry_params
        params.require(:inquiry).permit(:name, :email, :subject, :message, :status)
      end

      def check_admin
        render json: { error: 'Not Authorized' }, status: :unauthorized unless current_user&.role == 'admin' || current_user&.role == 1
      end
    end
  end
end
