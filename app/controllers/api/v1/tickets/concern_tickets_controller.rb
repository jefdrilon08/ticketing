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

        def create_concern_for
          @concern_for_record = ConcernFor.new(
            concern_id: params[:concern_id],
            name: params[:name],
            description: params[:description],
            status: "active"
          )
          # Rails.logger.debug "batman #{@concern_for_record.inspect}"
        
          if @concern_for_record.save
            redirect_to "/concern_tickets/#{@concern_for_record[:concern_id]}"
          else
            flash[:danger] = "Failed to add Concern For: #{@concern_for_record.errors.full_messages.join(', ')}"
            redirect_back(fallback_location: request.referer || root_path)
          end
        end

        def create_concern_type
          @concern_type_record = ConcernType.new(
            concern_id: params[:concern_id],
            name: params[:name],
            description: params[:description],
            status: "active"
          )
          Rails.logger.debug "batman #{@concern_type_record.inspect}"
        
          if @concern_type_record.save
            redirect_to "/concern_tickets/#{@concern_type_record[:concern_id]}"
          else
            flash[:danger] = "Failed to add Concern For: #{@concern_type_record.errors.full_messages.join(', ')}"
            redirect_back(fallback_location: request.referer || root_path)
          end
        end
        
      end
    end
  end
end
