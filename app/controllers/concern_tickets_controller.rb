class ConcernTicketsController < ApplicationController
  before_action :authenticate_user!

  def index
    if current_user.is_mis?
      @subheader_side_actions = [
        {
          id: "btn-new-concern",
          link: new_concern_ticket_path,
          class: "fa fa-plus",
          text: "New"
        }
      ]
    end  
  
    if current_user.is_mis?
      @records = ConcernTicket.includes(:user, :computer_system)
                               .order(:name)
                               .page(params[:page])
                               .per(15)
    else
      @records = ConcernTicket.includes(:user, :computer_system)
                               .where("is_private = ? OR id IN (?)", false, current_user.concern_ticket_users.pluck(:concern_ticket_id))
                               .order(:name)
                               .page(params[:page])
                               .per(15)
    end
  end
  
  def show
    @subheader_side_actions = [
      {
        id: "btn-create-ticket",
        link: "#",
        class: "fa fa-plus",
        text: "Create Ticket"
      }
    ]

    @concern_ticket = ConcernTicket.includes(concern_ticket_details: [:branch, :requested_user, :assigned_user]).find(params[:id])
    @branches = Branch.select(:id, :name)
    @concern_types = ConcernType.where(concern_id: @concern_ticket.id)
    @concern_fors = ConcernFor.where(concern_id: @concern_ticket.id)
    @developer_members = ConcernTicketUser
                          .joins(:user)
                          .where(concern_ticket_id: @concern_ticket.id, task: "developer")
                          .order('users.first_name ASC')
                          .map { |tu| { id: tu.user.id, name: "#{tu.user.first_name.titleize} #{tu.user.last_name.titleize}" } }

    initial_details_records = @concern_ticket.concern_ticket_details

    user_concern_ticket = ConcernTicketUser.find_by(user_id: current_user.id, concern_ticket_id: @concern_ticket.id)
    if user_concern_ticket&.task == "requester"
      initial_details_records = initial_details_records.where(requested_user_id: current_user.id)
    end

    @open_count = initial_details_records.where(status: "open").count
    @processing_count = initial_details_records.where(status: "processing").count
    @closed_count = initial_details_records.where(status: "closed").count
    @hold_count = initial_details_records.where("data->>'is_held' = ?", 'true').count

    @details_records = initial_details_records.dup 
    if params[:branch_id].present?
      @details_records = @details_records.where(branch_id: params[:branch_id])
    end

    # if params[:start_date].present?
    #   start_date = Date.parse(params[:start_date]) rescue nil
    #   @details_records = @details_records.where("DATE(created_at) >= ?", start_date) if start_date
    # end

    # if params[:end_date].present?
    #   end_date = Date.parse(params[:end_date]) rescue nil
    #   @details_records = @details_records.where("DATE(created_at) <= ?", end_date) if end_date
    # end

    if params[:concern_category].present?
      @details_records = @details_records.where("data->>'category' = ?", params[:concern_category])
    end

    if params[:concern_for_id].present?
      @details_records = @details_records.where(name_for_id: params[:concern_for_id])
    end

    if params[:assigned_user_id].present?
      @details_records = @details_records.where(assigned_user_id: params[:assigned_user_id])
    end

    if params[:ticket_status].present?
      if params[:ticket_status] == 'hold'
        @details_records = @details_records.where("data->>'is_held' = ?", 'true')
      else
        @details_records = @details_records.where(status: params[:ticket_status])
                                          .where("data->>'is_held' != ? OR data->>'is_held' IS NULL", 'true')
      end
    end

    @details_records = @details_records.order(
      Arel.sql("CASE WHEN status = 'open' THEN 0 WHEN status = 'processing' THEN 1 WHEN status = 'verification' THEN 2 ELSE 3 END"),
      created_at: :desc
    ).page(params[:page]).per(30)
  end

  def new_concern
    @computer_systems = ComputerSystem.select(:id, :name)
    @ct_users = User.select(:id, :first_name, :last_name).order(:last_name, :first_name)
  end

  def edit_concern
    @concern_ticket = ConcernTicket.find(params[:id])
    @computer_systems = ComputerSystem.select(:id, :name) || []
    @ct_users = User.select(:id, :first_name, :last_name).order(:last_name, :first_name)
  end

  def update
    @concern_ticket = ConcernTicket.find(params[:id])
    @concern_ticket.name = params[:name]
    @concern_ticket.ticket_name = params[:ticket_name]
    @concern_ticket.computer_system_id = params[:computer_system_id]
    @concern_ticket.is_private = params[:is_private] == "1"
    @concern_ticket.connect_to_item = params[:connect_to_item] == "1"
  
    ActiveRecord::Base.transaction do
      if @concern_ticket.save
        Rails.logger.debug "Updated Concern Ticket ID: #{@concern_ticket.id}"
  
        # Update Concern For
        if params[:selected_concern_fors].present?
          concern_for_data = params[:selected_concern_fors].split(",").map { |item| item.split(":") }
          concern_for_data.each do |name, status|
            concern_for = @concern_ticket.concern_fors.find_or_initialize_by(name: name.strip)
            concern_for.status = status.strip.downcase
            concern_for.save!
          end
        else
          @concern_ticket.concern_fors.destroy_all
        end
  
        # Update Concern Types
        if params[:selected_concern_types].present?
          concern_type_data = params[:selected_concern_types].split(",").map { |item| item.split(":") }
          concern_type_data.each do |name, status|
            concern_type = @concern_ticket.concern_types.find_or_initialize_by(name: name.strip)
            concern_type.status = status.strip.downcase
            concern_type.save!
          end
        else
          @concern_ticket.concern_types.destroy_all
        end
  
        flash[:success] = "Concern Ticket updated successfully!"
        redirect_to concern_tickets_path
      else
        Rails.logger.error "Failed to update Concern Ticket: #{@concern_ticket.errors.full_messages.join(', ')}"
        flash[:error] = "Failed to update concern ticket."
        render :edit_concern
      end
    end
  end

  def join
    concern_ticket_id = params[:concern_ticket_id]
    if concern_ticket_id.present?
      existing_record = ConcernTicketUser.find_by(user_id: current_user.id, concern_ticket_id: concern_ticket_id)
      if existing_record
        flash[:error] = "You have already joined this concern!"
        redirect_to concern_tickets_path
      else
        ConcernTicketUser.create!(
          user_id: current_user.id,
          status: "active",
          task: "unassigned",
          concern_ticket_id: concern_ticket_id
        )
        flash[:success] = "You have successfully joined the concern!"
        redirect_to concern_tickets_path
      end
    else
      Rails.logger.error "Failed to join: concern_ticket_id is missing"
      flash[:error] = "Failed to join the concern. Concern Ticket ID is missing."
      redirect_to concern_tickets_path
    end
  end
   
  def view_tix
    @branches = Branch.select(:id, :name).order(:name)
    @concern_ticket_details = ConcernTicketDetail.includes(:requested_user, :assigned_user, :concern_type).find(params[:id])
    @concern_ticket = ConcernTicket.find(@concern_ticket_details.concern_ticket_id)
    @concern_type = ConcernType.find(@concern_ticket_details.concern_type_id)
    @concern_froms = ConcernFor.where(concern_id: @concern_ticket_details.concern_ticket_id).order(:name)
    @concern_types = ConcernType.where(concern_id: @concern_ticket_details.concern_ticket_id).order(:name)
    @ticket_users = ConcernTicketUser
                    .where(concern_ticket_id: @concern_ticket.id, task: "developer")
                    .includes(:user)
                    .sort_by { |tu| tu.user.first_name.downcase }
  end

  def chat_message
    ticket_detail = ConcernTicketDetail.find(params[:id])
  
    if params[:content].blank?
      return redirect_back(fallback_location: view_tix_concern_ticket_path(ticket_detail.concern_ticket_id))
    end

    ticket_detail.data ||= {}

    chat_history = ticket_detail.data["chat_history"] || []
    chat_history << {
      user: "#{current_user.first_name.capitalize} #{current_user.last_name.capitalize}",
      comment: params[:content],
      timestamp: Time.current.strftime("%b %d, %Y %I:%M %p")
    }
  
    ticket_detail.data["chat_history"] = chat_history
  
    if ticket_detail.save
      
    else
      flash[:error] = "Failed to send message: #{ticket_detail.errors.full_messages.join(', ')}"
    end
  
    redirect_back(fallback_location: view_tix_concern_ticket_path(ticket_detail.concern_ticket_id))
  end

  def view_logs
    @concern_ticket = ConcernTicket.find(params[:id])
    @closed_details = @concern_ticket.concern_ticket_details
                                    .where(status: 'closed')
                                    .order(updated_at: :desc)
    user_ids = @closed_details.map { |d| d.data&.[]("closed_by") }.compact.uniq
    @users = User.where(id: user_ids).index_by(&:id)
  end

  def view_monitoring
    @concern_ticket = ConcernTicket.find(params[:id])
    @details = @concern_ticket.concern_ticket_details.select do |detail|
      assigns = detail.data&.dig("monitoring", "assign")
      assigns.present? && assigns.any?
    end
    @branches = Branch.where(id: @details.map(&:branch_id).uniq)
    @concern_fors = ConcernFor.where(id: @details.map(&:name_for_id).uniq)
    user_ids = []
    @details.each do |detail|
      assigns = detail.data&.dig("monitoring", "assign") || []
      assigns.each do |entry|
        user_ids << entry["reassigned_by"]
        user_ids << entry["new_assigned_user"]
      end
    end
    @users = User.where(id: user_ids.uniq).index_by(&:id)
  end
end