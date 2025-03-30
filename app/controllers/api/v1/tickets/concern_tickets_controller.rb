module Api
  module V1
    module Tickets
      class ConcernTicketsController < ApiController
        before_action :authenticate_user!

        def create_concern
          config = {
            name: params[:name],
            ticket_name: params[:ticket_name],
            description: nil,
            status: "active",
            computer_system_id: params[:computer_system_id],
            user_id: current_user.id
          }
        
          errors = ::Tickets::ValidateCreate.new(config: config).execute!
          
          if errors[:messages].any?
            render json: errors, status: 400
          else
            concern_ticket = ::Tickets::Create.new(config: config).execute!
        
            if concern_ticket.save!
              concern_ticket.reload
              Rails.logger.debug "New Concern Ticket ID: #{concern_ticket.id}"
        
              if params[:selected_members].present?
                member_ids = params[:selected_members].split(",")
                Rails.logger.debug "Member IDs: #{member_ids.inspect}"
                
                member_ids.each do |user_id|
                  ConcernTicketUser.create!(
                    user_id: user_id,
                    status: "active",
                    concern_ticket_id: concern_ticket.id
                  )
                end
              end

              if params[:selected_concern_fors].present?
                concern_for_names = params[:selected_concern_fors].split(",")
              
                concern_for_names.each do |name|
                  ConcernFor.create!(
                    concern_id: concern_ticket.id,
                    name: name.strip,
                    description: nil,
                    status: "active"
                  )
                end
              end
              
              if params[:selected_concern_types].present?
                concern_type_names = params[:selected_concern_types].split(",")
              
                concern_type_names.each do |name|
                  ConcernType.create!(
                    concern_id: concern_ticket.id,
                    name: name.strip,
                    description: nil,
                    status: "active"
                  )
                end
              end
              
              redirect_to "/concern_tickets"
            else
              Rails.logger.error "Failed to create Concern Ticket: #{concern_ticket.errors.full_messages.join(', ')}"
              flash[:error] = "Failed to create concern ticket."
              redirect_back(fallback_location: request.referer || root_path)
            end
          end
        end

        def create_ticket
          concern_ticket = ConcernTicket.find(params[:concern_ticket_id])
          ticket_count = ConcernTicketDetail.where(concern_ticket_id: concern_ticket.id).count
          ticket_number = "#{concern_ticket.ticket_name} - #{(ticket_count + 1).to_s.rjust(4, '0')}"

          Rails.logger.debug "batbat: #{concern_ticket.inspect}"
          @concern_ticket_record = ConcernTicketDetail.new(
            ticket_number: ticket_number,
            concern_ticket_id: params[:concern_ticket_id],
            description: params[:description],
            status: "open",
            name_for_id: params[:name_for_id],
            concern_type_id: params[:concern_type_id],
            branch_id: params[:branch_id],
            requested_user_id: current_user.id,
            assigned_user_id: concern_ticket.user_id
          )
          Rails.logger.debug "status for updatezzz: #{params[:attachments].inspect}"

          if params[:attachments].present?
            attachments = Array(params[:attachments]) # para maging array
            Rails.logger.debug "Processed attachments array: #{attachments.map(&:original_filename)}"
        
            attachments.each do |attachment|
              @concern_ticket_record.attachments.attach(attachment)
            end
          end
        
          if @concern_ticket_record.save
            redirect_to "/concern_tickets/#{@concern_ticket_record[:concern_ticket_id]}"
          else
            flash[:error] = "Failed to create ticket: #{@concern_ticket_record.errors.full_messages.join(', ')}"
            redirect_back(fallback_location: request.referer || root_path)
          end
        end
        
        # def create_concern_for
        #   @concern_for_record = ConcernFor.new(
        #     concern_id: params[:concern_id],
        #     name: params[:name],
        #     description: params[:description],
        #     status: "active"
        #   )

        #   if @concern_for_record.save
        #     redirect_to "/concern_tickets/#{@concern_for_record[:concern_id]}"
        #   else
        #     flash[:danger] = "Failed to add Concern For: #{@concern_for_record.errors.full_messages.join(', ')}"
        #     redirect_back(fallback_location: request.referer || root_path)
        #   end
        # end

        # def create_concern_type
        #   @concern_type_record = ConcernType.new(
        #     concern_id: params[:concern_id],
        #     name: params[:name],
        #     description: params[:description],
        #     status: "active"
        #   )

        #   if @concern_type_record.save
        #     redirect_to "/concern_tickets/#{@concern_type_record[:concern_id]}"
        #   else
        #     flash[:danger] = "Failed to add Concern Type: #{@concern_type_record.errors.full_messages.join(', ')}"
        #     redirect_back(fallback_location: request.referer || root_path)
        #   end
        # end

        def update_status #para sa Ticket Status or Concern Ticket Detail
          Rails.logger.debug "Received update request: #{params.inspect}"
          @ctd_status = ConcernTicketDetail.find_by(ticket_number: params[:ticket_number])
        
          if @ctd_status
            update_params = { status: params[:status] }
            update_params[:assigned_user_id] = current_user.id if params[:status] == "processing"
        
            if @ctd_status.update(update_params)
              render json: { success: true, status: @ctd_status.status, ticket_number: @ctd_status.ticket_number }
            else
              render json: { success: false, errors: @ctd_status.errors.full_messages }, status: :unprocessable_entity
            end
          else
            render json: { success: false, error: "Ticket not found" }, status: :not_found
          end
        end

        def update_member_status
          ct_user = ConcernTicketUser.find(params[:id])
          new_status = ct_user.status.downcase == "active" ? "inactive" : "active"
        
          if ct_user.update(status: new_status)
            render json: { success: true, status: new_status }
          else
            render json: { success: false, error: ct_user.errors.full_messages.join(", ") }, status: :unprocessable_entity
          end
        end
        

        def add_member_ct
          @concern_ticket = ConcernTicket.find(params[:concern_ticket_id])
          user_id = params[:ct_user_id]
        
          @ctd_member = ConcernTicketUser.new(
            user_id: user_id,
            status: "active",
            concern_ticket_id: @concern_ticket.id
          )
        
          if @ctd_member.save
            redirect_to "/concern_tickets/#{@concern_ticket.id}/edit"
          else
            flash[:danger] = "Failed to add Member: #{@ctd_member.errors.full_messages.join(', ')}"
            redirect_back(fallback_location: request.referer || root_path)
          end
        end
        

      end
    end
  end
end
