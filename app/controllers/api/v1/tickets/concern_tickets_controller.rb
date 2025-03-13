module Api
  module V1
    module Tickets
      class ConcernTicketsController < ApiController
        before_action :authenticate_user! 

        def create_concern
          Rails.logger.debug "Status received: #{params[:status]}"
          config = {
            name: params[:name],
            description: params[:description],
            status: params[:status],
            computer_system_id: params[:computer_system_id],
            # user_id: params[:user_id]
          }
          
          errors = ::Tickets::ValidateCreate.new(config: config).execute!
          Rails.logger.debug "SPIDEY"
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

        def create_ticket
          Rails.logger.debug "TESTING: #{params[:status]}"
          config = {
            name: params[:name],
            description: params[:description],
            status: params[:status],
            computer_system_id: params[:computer_system_id],
          }
        end

        def add_concern_type
          Rails.logger.debug "Received concern_ticket_id: #{params[:concern_ticket_id]}"
          concern_ticket = ConcernTicket.find(params[:concern_ticket_id])
        
          concern_type = concern_ticket.concern_types.build(name: params[:name], status: "active")
        
          if concern_type.save
            flash[:success] = "Concern Type added successfully!"
          else
            flash[:error] = "Failed to add Concern Type: #{concern_type.errors.full_messages.join(', ')}"
          end
        
          redirect_back(fallback_location: request.referer || root_path)
        end
        
        
        

      end
    end
  end
end
