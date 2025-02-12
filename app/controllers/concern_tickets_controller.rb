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

    @records = ConcernTicket.page(params[:page]).per(10)
    @computer_systems = ComputerSystem.select(:id, :name) 
  end

  def show

    @subheader_side_actions = [
        {
          id: "btn-create",
          link: "#",
          class: "fa fa-plus",
          text: "Create Ticket"
        }
      ]

    @concern_ticket = ConcernTicket.find(params[:id])
    @concern_ticket_details = @concern_ticket.concern_ticket_details
  
    Rails.logger.debug("Concern Ticket Details: #{@concern_ticket_details.inspect}")
    
    
  end

end