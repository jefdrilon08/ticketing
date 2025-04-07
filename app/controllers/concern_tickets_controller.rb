class ConcernTicketsController < ApplicationController
  before_action :authenticate_user!

  def index
    @subheader_side_actions = [
      {
        id: "btn-new",
        link: current_user.is_mis? ? new_concern_ticket_path : "#",
        class: "fa fa-plus #{'disabled' unless current_user.is_mis?}",
        text: "New"
      }
    ]
    @records = ConcernTicket.includes(:user, :computer_system).order(:name).page(params[:page]).per(15)
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
  
    #para sa filter
    @details_records = @concern_ticket.concern_ticket_details
  
    if params[:branch_id].present?
      @details_records = @details_records.where(branch_id: params[:branch_id])
    end
  
    if params[:start_date].present?
      start_date = Date.parse(params[:start_date]) rescue nil
      @details_records = @details_records.where("DATE(created_at) = ?", start_date) if start_date
    end
  
    if params[:ticket_status].present?
      @details_records = @details_records.where(status: params[:ticket_status])
    end
  
    @details_records = @details_records.order(status: :desc, created_at: :asc).page(params[:page]).per(15)
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
  
    ActiveRecord::Base.transaction do
      if @concern_ticket.save
        Rails.logger.debug "Updated Concern Ticket ID: #{@concern_ticket.id}"
  
        # Update Concern For
        if params[:selected_concern_fors].present?
          concern_for_names = params[:selected_concern_fors].split(",").map(&:strip)
          @concern_ticket.concern_fors.where.not(name: concern_for_names).destroy_all
          concern_for_names.each do |name|
            @concern_ticket.concern_fors.find_or_create_by!(name: name, status: "active")
          end
        else
          @concern_ticket.concern_fors.destroy_all
        end
  
        # Update Concern Types
        if params[:selected_concern_types].present?
          concern_type_names = params[:selected_concern_types].split(",").map(&:strip)
          @concern_ticket.concern_types.where.not(name: concern_type_names).destroy_all
          concern_type_names.each do |name|
            @concern_ticket.concern_types.find_or_create_by!(name: name, status: "active")
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
          concern_ticket_id: concern_ticket_id,
          status: "active",
          task: nil
        )
        flash[:success] = "You have successfully joined the concern!"
        redirect_to concern_tickets_path
      end
    else
      flash[:error] = "Failed to join the concern. Concern Ticket ID is missing."
      redirect_to concern_tickets_path
    end
  end
  
  def view_tix
    @concern_ticket_details = ConcernTicketDetail.includes(:requested_user, :assigned_user).find(params[:id])
    @concern_ticket = ConcernTicket.find(@concern_ticket_details.concern_ticket_id)
    @concern_type = ConcernType.find(@concern_ticket_details.concern_type_id)
  
    @ticket_users = ConcernTicketUser.where(concern_ticket_id: @concern_ticket.id).includes(:user)
    Rails.logger.debug "ticket users: #{@ticket_users.inspect}"
  end
  
end
