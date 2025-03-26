class ConcernTicketsController < ApplicationController
  before_action :authenticate_user!

  def index
    @subheader_side_actions = [
      {
        id: "btn-new",
        link: new_concern_ticket_path,
        class: "fa fa-plus",
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
    @details_records = @concern_ticket.concern_ticket_details.order(status: :desc, created_at: :asc).page(params[:page]).per(15)
    @concern_types = ConcernType.where(concern_id: @concern_ticket.id)
    @concern_fors = ConcernFor.where(concern_id: @concern_ticket.id)
  end

  def new_concern
    @computer_systems = ComputerSystem.select(:id, :name)
    @ct_users = User.select(:id, :first_name, :last_name).order(:last_name, :first_name)
  end

  def edit_concern
    @concern_ticket = ConcernTicket.find(params[:id])
    Rails.logger.debug "zxc: #{@concern_ticket.inspect}"
    @computer_systems = ComputerSystem.select(:id, :name) || []
    @ct_users = User.select(:id, :first_name, :last_name).order(:last_name, :first_name)
  end

  def update #para sa Concern Ticket
    @concern_ticket = ConcernTicket.find(params[:id])

    @concern_ticket.name = params[:name]
    @concern_ticket.ticket_name = params[:ticket_name]
    @concern_ticket.computer_system_id = params[:computer_system_id]

    if @concern_ticket.save
      flash[:success] = "Concern Ticket updated successfully!"
      redirect_to concern_tickets_path
    else
      flash[:error] = "Failed to update concern ticket."
      render :edit_concern
    end
  end
  
  def view_tix
    @concern_ticket_details = ConcernTicketDetail.includes(:requested_user, :assigned_user).find(params[:id])
    @concern_ticket = ConcernTicket.find(@concern_ticket_details.concern_ticket_id)
    @concern_type = ConcernType.find(@concern_ticket_details.concern_type_id)
  end
end
