module Api
  module V1
    module Tickets
      class ConcernTicketsController < ApiController
        before_action :authenticate_user!

        def create_concern
          Rails.logger.debug "Params received: #{params.inspect}"
          config = {
            name: params[:name],
            ticket_name: params[:ticket_name],
            description: nil,
            status: "active",
            computer_system_id: params[:computer_system_id],
            user_id: current_user.id,
            is_private: params[:is_private] == "1",
            connect_to_item: params[:connect_to_item] == "1"
          }

          Rails.logger.debug "Config: #{config.inspect}"

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
                member_ids.each do |user_id|
                  ConcernTicketUser.create!(
                    user_id: user_id,
                    status: "active",
                    task: "unassigned",
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

          max_retries = 5
          retries = 0

          begin
            ticket_count = ConcernTicketDetail.where(concern_ticket_id: concern_ticket.id).count
            ticket_number = "#{concern_ticket.ticket_name} - #{(ticket_count + 1).to_s.rjust(4, '0')}"

            @concern_ticket_record = ConcernTicketDetail.new(
              ticket_number: ticket_number,
              concern_ticket_id: params[:concern_ticket_id],
              description: params[:description],
              data: {
                category: "low",
                is_held: "false"
              },
              status: "open",
              name_for_id: params[:name_for_id],
              concern_type_id: params[:concern_type_id],
              branch_id: params[:branch_id],
              requested_user_id: current_user.id,
              assigned_user_id: concern_ticket.user_id
            )

            if params[:attachments].present?
              attachments = Array(params[:attachments])
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
          rescue ActiveRecord::RecordNotUnique => e
            retries += 1
            if retries <= max_retries
              Rails.logger.warn "Duplicate ticket number detected. Retrying... (Attempt #{retries})"
              retry
            else
              Rails.logger.error "Failed to create ticket after #{max_retries} attempts: #{e.message}"
              flash[:error] = "Failed to create ticket due to a system error. Please try again."
              redirect_back(fallback_location: request.referer || root_path)
            end
          end
        end

        def update_status #para sa Ticket Status or Concern Ticket Detail
          Rails.logger.debug "Received update request: #{params.inspect}"
          @ctd_status = ConcernTicketDetail.find_by(ticket_number: params[:ticket_number])

          if @ctd_status
            update_params = { status: params[:status] }
            update_params[:assigned_user_id] = current_user.id if params[:status] == "processing"


            data = @ctd_status.data || {}
            status_history = data["status_history"] || {}

            unless status_history[params[:status]]
              status_history[params[:status]] = Time.current.iso8601
            end

            data["status_history"] = status_history

            #logs
            if params[:status] == "closed"
              data["closed_by"] = current_user.id
            end

            update_params[:data] = data

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
          Rails.logger.debug "Params received: #{params.inspect}"
          ct_user = ConcernTicketUser.find(params[:id])

          roles = params[:roles].downcase if params[:roles].present?
          status = params[:status].downcase if params[:status].present?

          if ct_user.update(task: roles, status: status)
            render json: { success: true }
          else
            render json: { success: false, error: ct_user.errors.full_messages.join(", ") }, status: :unprocessable_entity
          end
        end

        def add_member_ct
          @concern_ticket = ConcernTicket.find(params[:concern_ticket_id])
          user_id = params[:ct_user_id]
          existing_member = ConcernTicketUser.find_by(user_id: user_id, concern_ticket_id: @concern_ticket.id)

          if existing_member
            flash[:danger] = "The user is already a member of this concern ticket."
            redirect_back(fallback_location: request.referer || root_path)
          else
            @ctd_member = ConcernTicketUser.new(
              user_id: user_id,
              task: "unassigned",
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

        def edit_all_fields
          @ticket_details = ConcernTicketDetail.find_by(id: params[:ctd_id])
          if @ticket_details
            updated = false

            if params[:branch_id].present?
              @ticket_details.branch_id = params[:branch_id]
              updated = true
            end

            if params[:concern_from_id].present?
              @ticket_details.name_for_id = params[:concern_from_id]
              updated = true
            end

            if params[:concern_type_id].present?
              @ticket_details.concern_type_id = params[:concern_type_id]
              updated = true
            end

            if params[:concern_category].present?
              @ticket_details.data ||= {}
              @ticket_details.data["category"] = params[:concern_category]
              updated = true
            end

            if params[:assigned_person_id].present?
              @ticket_details.assigned_user_id = params[:assigned_person_id]
              updated = true
            end

            if updated && @ticket_details.save
              redirect_to view_tix_concern_ticket_path(@ticket_details), notice: "Ticket details updated successfully!"
            else
              flash[:error] = "Failed to update: #{@ticket_details.errors.full_messages.join(', ')}"
              redirect_to view_tix_concern_ticket_path(@ticket_details)
            end
          else
            flash[:error] = "Ticket not found."
            redirect_back(fallback_location: request.referer || root_path)
          end
        end

        # def edit_branch
        #   @ticket_details = ConcernTicketDetail.find_by(id: params[:ctd_id])
        #   if @ticket_details
        #     if params[:branch_id].present?
        #       @ticket_details.branch_id = params[:branch_id]

        #       if @ticket_details.save
        #         redirect_to view_tix_concern_ticket_path(@ticket_details), message: "Branch updated successfully!"
        #       else
        #         flash[:error] = "Failed to update branch: #{@ticket_details.errors.full_messages.join(', ')}"
        #         redirect_to view_tix_concern_ticket_path(@ticket_details)
        #       end
        #     else
        #       flash[:error] = "Branch cannot be blank."
        #       redirect_to view_tix_concern_ticket_path(@ticket_details)
        #     end
        #   else
        #     flash[:error] = "Ticket not found."
        #     redirect_back(fallback_location: request.referer || root_path)
        #   end
        # end

        # def update_assigned_person
        #   @ticket_details = ConcernTicketDetail.find_by(id: params[:ctd_id])

        #   if @ticket_details
        #     @ticket_details.assigned_user_id = params[:assigned_person_id]

        #     if @ticket_details.save
        #       redirect_to view_tix_concern_ticket_path(@ticket_details), message: "Assigned person updated successfully!"
        #     else
        #       flash[:error] = "Failed to update assigned person: #{@ticket_details.errors.full_messages.join(", ")}"
        #       redirect_to view_tix_concern_ticket_path(@ticket_details)
        #     end
        #   else
        #     flash[:error] = "Ticket not found"
        #     redirect_to view_tix_concern_ticket_path(@ticket_details)
        #   end
        # end

        # def edit_concern_from
        #   @ticket_details = ConcernTicketDetail.find_by(id: params[:ctd_id])
        #   if @ticket_details
        #     if params[:concern_from_id].present?
        #       @ticket_details.name_for_id = params[:concern_from_id]

        #       if @ticket_details.save
        #         redirect_to view_tix_concern_ticket_path(@ticket_details), message: "Concern from updated successfully!"
        #       else
        #         flash[:error] = "Failed to update concern from: #{@ticket_details.errors.full_messages.join(', ')}"
        #         redirect_to view_tix_concern_ticket_path(@ticket_details)
        #       end
        #     else
        #       flash[:error] = "Concern from cannot be blank."
        #       redirect_to view_tix_concern_ticket_path(@ticket_details)
        #     end
        #   else
        #     flash[:error] = "Ticket not found."
        #     redirect_back(fallback_location: request.referer || root_path)
        #   end
        # end

        # def edit_concern_type
        #   @ticket_details = ConcernTicketDetail.find_by(id: params[:ctd_id])
        #   if @ticket_details
        #     if params[:concern_type_id].present?
        #       @ticket_details.concern_type_id = params[:concern_type_id]

        #       if @ticket_details.save
        #         redirect_to view_tix_concern_ticket_path(@ticket_details), message: "Concern type updated successfully!"
        #       else
        #         flash[:error] = "Failed to update concern type: #{@ticket_details.errors.full_messages.join(', ')}"
        #         redirect_to view_tix_concern_ticket_path(@ticket_details)
        #       end
        #     else
        #       flash[:error] = "Concern type cannot be blank."
        #       redirect_to view_tix_concern_ticket_path(@ticket_details)
        #     end
        #   else
        #     flash[:error] = "Ticket not found."
        #     redirect_back(fallback_location: request.referer || root_path)
        #   end
        # end

        # def edit_concern_category
        #   @ticket_details = ConcernTicketDetail.find_by(id: params[:ctd_id])
        #   if @ticket_details
        #     if params[:concern_category].present?
        #       @ticket_details.data["category"] = params[:concern_category]

        #       if @ticket_details.save
        #         redirect_to view_tix_concern_ticket_path(@ticket_details), message: "Category updated successfully!"
        #       else
        #         flash[:error] = "Failed to update category: #{@ticket_details.errors.full_messages.join(', ')}"
        #         redirect_to view_tix_concern_ticket_path(@ticket_details)
        #       end
        #     else
        #       flash[:error] = "Category cannot be blank."
        #       redirect_to view_tix_concern_ticket_path(@ticket_details)
        #     end
        #   else
        #     flash[:error] = "Ticket not found."
        #     redirect_back(fallback_location: request.referer || root_path)
        #   end
        # end

        def toggle_hold
          ticket = ConcernTicketDetail.find_by(id: params[:id])

          if ticket.nil?
            render json: { success: false, error: "Ticket not found" }, status: :not_found
            return
          end

          current_data = ticket.data || {}
          is_held = current_data["is_held"] == "true"
          current_data["is_held"] = (!is_held).to_s

          if ticket.update(data: current_data)
            render json: { success: true, held: current_data["is_held"] }
          else
            render json: { success: false, error: "Unable to update ticket" }, status: :unprocessable_entity
          end
        end

      end
    end
  end
end
