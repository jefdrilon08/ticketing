class NewSystemTicketController < ApplicationController
    before_action :authenticate_user!

    def create_systemtix
        members_arr=[]
        params[:members].each do|x|
            members_arr.push([x,"Member"])
        end
        puts params
        @record     =SystemTicket.new(
                                        computer_system_id:params[:computer_system_id],
                                        status:'pending',
                                        user_id:nil
                                    )
        if @record.save
        @record2=SystemTicketDesc.new(
                ticket_number:nil,
                system_ticket_id:@record[:id],
                system_type:nil,
                title:nil,
                description:params[:description],
                status:"pending",
                data:   {
                            team_members:members_arr,
                            attached_file:params[:file],
                            save_details:nil,
                        },
                date_received:DateTime.now(),
                start_date:nil,
                expected_goal:nil
            )
            if @record2.save
                redirect_to "/system_tickets/#{@record2[:id]}"
            else
                render :new, status: :unprocessable_entity
            end
        end
    end
end
