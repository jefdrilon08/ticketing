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
    
    @concern_ticket = ConcernTicket.includes(:concern_ticket_details).find(params[:id])
    @concern_ticket_details = @concern_ticket.concern_ticket_details
    Rails.logger.debug("Concern Ticket Details: #{@concern_ticket_details.inspect}")
    @concern_types = ConcernType.select(:id, :name)
    @branches = Branch.select(:id, :name)

  end

end