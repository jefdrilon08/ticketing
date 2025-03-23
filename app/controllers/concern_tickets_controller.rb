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

    #pag fetch ng lahat ng records
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
  
    @concern_ticket = ConcernTicket.includes(concern_ticket_details: [:branch, :user]).find(params[:id])
    Rails.logger.debug "batman #{@concern_ticket.inspect}"  #nilabas yung details ng isang concern ticket
  
    @branches = Branch.select(:id, :name)
  
    #pagination
    @details_records = @concern_ticket.concern_ticket_details.order(status: :desc, created_at: :asc).page(params[:page]).per(15)
    Rails.logger.debug "spider #{@details_records.inspect}"  #nilabas yung details ng isang concern ticket details
  
    #pagkuha ng lahat ng concern type na nakabase sa kung anong concern ticket id
    @concern_types = ConcernType.where(concern_id: @concern_ticket.id)
  
    #pagkuha ng lahat ng concern for names na nakabase sa kung anong concern ticket id
    @concern_fors = ConcernFor.where(concern_id: @concern_ticket.id)
  end
  

  def new_concern
    @computer_systems = ComputerSystem.select(:id, :name)
  end

  def view_tix
    @concern_ticket_details = ConcernTicketDetail.includes(:user).find(params[:id])
    @concern_ticket = ConcernTicket.find(@concern_ticket_details.concern_ticket_id)
    @concern_type = ConcernType.find(@concern_ticket_details.concern_type_id)

  end
  

end