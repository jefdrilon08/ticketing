class ConcernTicketsController < ApplicationController
  before_action :authenticate_user!

  def index

    @subheader_side_actions = [
        {
          id: "btn-new",
          link: "#",
          class: "fa fa-plus",
          text: "New"
        }
      ]
    
    @records = ConcernTicket.includes(:user, :computer_system).order(:name).page(params[:page]).per(15)
    Rails.logger.debug "@records details #{@records.inspect}" 

    @computer_systems = ComputerSystem.select(:id, :name)
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
    
    @concern_ticket = ConcernTicket.includes(concern_ticket_details: :branch).find(params[:id])
    Rails.logger.debug "batman #{@concern_ticket.inspect}" 
    @branches = Branch.select(:id, :name)

    #fetching concern ticket details
    @details_records  = @concern_ticket.concern_ticket_details

    #pagkuha ng lahat ng concern type na nakabase sa kung anong concern ticket id
    @concern_types = ConcernType.where(concern_id: @concern_ticket.id)
  end
  
  def view_tix
    @concern_ticket_details = ConcernTicketDetail.find(params[:id])
    @concern_ticket = ConcernTicket.find(@concern_ticket_details.concern_ticket_id)
    @concern_type = ConcernType.find(@concern_ticket_details.concern_type_id)

  end
  

end