module Api
  module V1
    module Tickets
      class ConcernTicketsController < ApiController
        before_action :authenticate_user! 
        
        def index
          concern_tickets = ConcernTicket.includes(:computer_system).all
        
          concern_tickets_json = concern_tickets.map do |ticket|
            {
              id: ticket.id,
              name: ticket.name,
              description: ticket.description,
              status: ticket.status,
              computer_system_id: ticket.computer_system_id,
              computer_system_name: ticket.computer_system&.name # Get the name
            }
          end
        
          render json: { concern_tickets: concern_tickets_json }, status: :ok
        end
        
        
        def create
          config = {
            name: params[:name],
            description: params[:description],
            status: params[:status],
            computer_system_id: params[:computer_system_id]
          }
          
          errors = ::Tickets::ValidateCreate.new(config: config).execute!
        
          if errors[:messages].any?
            render json: errors, status: 400
          else
            concern_ticket = ::Tickets::Create.new(config: config).execute!
            render json: { 
              success: true, 
              message: 'Concern Ticket Created', 
              status: 200,
              data: {
                id: concern_ticket.id,
                name: concern_ticket.name,
                description: concern_ticket.description,
                status: concern_ticket.status,
                computer_system_id: concern_ticket.computer_system_id,
                computer_system_name: concern_ticket.computer_system&.name
              }
            }
          end
        end
        
        def update
          config = {
            id: params[:id],
            name: params[:name],
            description: params[:description],
            status: params[:status]
          }
        
          concern_ticket = ::ConcernTicket.find_by(id: params[:id])
          if concern_ticket && concern_ticket.update(config)
            render json: { success: true, message: 'Concern Ticket Updated', status: 200 }
          else
            render json: { errors: concern_ticket&.errors&.full_messages || ['Concern ticket not found'] }, 
                   status: :unprocessable_entity
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
