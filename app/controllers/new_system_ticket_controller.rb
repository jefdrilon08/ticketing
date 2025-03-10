class NewSystemTicketController < ApplicationController
    before_action :authenticate_user!
        # cs_name = ComputerSystem.find(params[:id]).name

    def create_systemtix2
        puts "pumasok"
        @record     =SystemTicket.new(
                                        computer_system_id:params[:computer_system_id],
                                        status:'pending',
                                        user_id:nil
                                    )
        if @record.save
            redirect_to "/system_tickets/"
        else
            render :new, status: :unprocessable_entity
        end
    end

    def create_systemtix
        members_arr=[]
        params[:members].each do|x|
            members_arr.push([x,"Member",nil])
        end
        puts params

        @record=SystemTicketDesc.new(
                ticket_number:nil,
                system_ticket_id:params[:id],
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
            if @record.save
                redirect_to "/system_tickets/#{@record[:id]}"
            else
                render :new, status: :unprocessable_entity
            end
    end
end
