module Api
  module V1
    module Tickets
      class ConcernTicketsController < ApiController
        before_action :authenticate_user!

        def create_concern
          Rails.logger.debug "Status received: #{params[:status]}"
          config = {
            name: params[:name],
            description: nil,
            status: "active",
            computer_system_id: params[:computer_system_id]
          }

          errors = ::Tickets::ValidateCreate.new(config: config).execute!
          if errors[:messages].any?
            render json: errors, status: 400
          else
            ::Tickets::Create.new(config: config).execute!
            redirect_to "/concern_tickets"
          end
        end

        def create_ticket
          concern_ticket = ConcernTicket.find(params[:concern_ticket_id])
          ticket_count = ConcernTicketDetail.where(concern_ticket_id: concern_ticket.id).count
          ticket_number = "#{concern_ticket.ticket_name} - #{(ticket_count + 1).to_s.rjust(4, '0')}"

          @concern_ticket_record = ConcernTicketDetail.new(
            ticket_number: ticket_number,
            concern_ticket_id: params[:concern_ticket_id],
            description: params[:description],
            status: "open",
            name_for_id: params[:name_for_id],
            concern_type_id: params[:concern_type_id],
            branch_id: params[:branch_id],
            requested_user_id: current_user.id
          )

          if @concern_ticket_record.save
            redirect_to "/concern_tickets/#{@concern_ticket_record[:concern_ticket_id]}"
          else
            flash[:error] = "Failed to create ticket: #{@concern_ticket_record.errors.full_messages.join(', ')}"
            redirect_back(fallback_location: request.referer || root_path)
          end
        end

        def create_concern_for
          @concern_for_record = ConcernFor.new(
            concern_id: params[:concern_id],
            name: params[:name],
            description: params[:description],
            status: "active"
          )

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

          if @concern_type_record.save
            redirect_to "/concern_tickets/#{@concern_type_record[:concern_id]}"
          else
            flash[:danger] = "Failed to add Concern Type: #{@concern_type_record.errors.full_messages.join(', ')}"
            redirect_back(fallback_location: request.referer || root_path)
          end
        end

        # def update_status
        #   @ctd_status = ConcernTicketDetail.find_by(ticket_number: params[:ticket_number])
        
        #   if @ctd_status
        #     update_params = { status: params[:status] }
        #     update_params[:assigned_user_id] = current_user.id if params[:status] == "processing"
    
        #   else
        #     render json: { success: false, error: "Ticket not found" }, status: :not_found
        #   end
        # end
        
        
      end
    end
  end
end
