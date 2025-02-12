module Api
    module V1
      module TicketConcern
        class ConcernTicketsController < ApiController
            before_action :authenticate_user!
        #   before_action :set_holiday, only: [:show, :update, :destroy]
  
        #   def index
        #     holidays = Holiday.all
        #     render json: holidays
        #   end
          
        #   def show
        #     render json: @holiday
        #   end
  
          def new
            concern = ConcernTicket.new(concern_params)
          
            if concern.save
              render json: { message: 'Concern successfully created', status: 200, data: { concern: concern } }, status: :created
            else
              render json: { errors: concern.errors.full_messages }, status: :unprocessable_entity
            end
          end
  
          private
  
          def set_concern
            @concern_ticket = ConcernTicket.find_by(id: params[:id])
            unless @concern_ticket
              render json: { error: 'ConcernTicket not found' }, status: :not_found
            end
          end
  
          private

          def concern_params
            params.require(:concern_ticket).permit(:concern_name, :computer_system_id, :status)
          end

        end
      end
    end
  end