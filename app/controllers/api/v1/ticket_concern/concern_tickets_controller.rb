module Api
  module V1
    module TicketConcern
      class ConcernTicketsController < ApiController
        before_action :authenticate_user!

        def index
          concern_tickets = ConcernTicket.all
          render json: { concern_tickets: concern_tickets }, status: :ok
        end
        
        def create
          config = {
            name: params[:name],
            description: params[:description],
            status: params[:status]
          }

          errors = ::ConcernTicket::ValidateCreate.new(config: config).execute!

          if errors[:messages].any?
            render json: errors, status: 400
          else
            result = ::Administration::ComputerSystem::AddSystem.new(config: config).execute!
            render json: { success: true, message: 'Concern Ticket Created', status: 200 }
          end
        end

        def update
          config = {
            id: params[:id],
            name: params[:name],
            description: params[:description],
            status: params[:status]
          }

          concern_ticket = ConcernTicket.find_by(id: params[:id])
          if concern_ticket.update(config)
            render json: { success: true, message: 'Concern Ticket Updated', status: 200 }
          else
            render json: { errors: concern_ticket.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def concern_params
          params.require(:concern_ticket).permit(:name, :description, :computer_system_id, :status)
        end
      end
    end
  end
end
