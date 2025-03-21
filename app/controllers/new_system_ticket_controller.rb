class NewSystemTicketController < ApplicationController
    before_action :authenticate_user!
        # cs_name = ComputerSystem.find(params[:id]).name

    def create_systemtix2
        members_arr=[]

        members_arr.push(current_user.id)
        params[:members].each do|x|
            members_arr.push(x)
        end
        @record     =SystemTicket.new(
                                        computer_system_id:params[:computer_system_id],
                                        status:'pending',
                                        user_id:current_user.id,
                                        data:   {
                                                    team_members:members_arr
                                                },
                                        system_number:SystemTicket.all.count+1
                                    ).save

        members_arr.each do|x|
            if x==current_user.id
                SystemTicketsUser.new(
                                        user_id:x,
                                        status:"admin",
                                        system_ticket_id:SystemTicket.where(computer_system_id:params[:computer_system_id])[0].id
                                    ).save
            else
                SystemTicketsUser.new(
                                        user_id:x,
                                        status:"active",
                                        system_ticket_id:SystemTicket.where(computer_system_id:params[:computer_system_id])[0].id
                                    ).save
            end
        end
            redirect_to "/system_tickets/"
    end

    def create_systemtix
        puts params

        main_dev=SystemTicketsUser.where(user_id:current_user.id,system_ticket_id:params[:id])[0]

        tn_fin="ST#{SystemTicket.find(params[:id]).system_number}-#{SystemTicketDesc.where(system_ticket_id:params[:id]).length+1}"

        file_arr=[]

        if params[:file]!=nil
            params[:file].each do |x|
                file_arr.push(x)
            end

            @record=SystemTicketDesc.new(
                ticket_number:tn_fin,
                system_ticket_id:params[:id],
                system_type:nil,
                title:params[:title],
                file:file_arr,
                description:params[:description],
                status:"pending",
                data:   {
                            team_members:[[main_dev.id,"Main Dev"]],
                            save_details:nil,
                            on_hold:false,
                            hold_details:nil,
                            file:file_arr
                        },
                date_received:DateTime.now(),
                start_date:nil,
                target_date:params[:date],
                expected_goal:nil,
                request_type:params[:request_type],
                requested_by:current_user.id
            )
        else
            @record=SystemTicketDesc.new(
                ticket_number:tn_fin,
                system_ticket_id:params[:id],
                system_type:nil,
                title:params[:title],
                description:params[:description],
                status:"pending",
                data:   {
                            team_members:[[main_dev.id,"Main Dev"]],
                            save_details:nil,
                            on_hold:false,
                            hold_details:nil,
                            file:file_arr
                        },
                date_received:DateTime.now(),
                start_date:nil,
                target_date:params[:date],
                expected_goal:nil,
                request_type:params[:request_type],
                requested_by:current_user.id
            )

        end

            if @record.save
                redirect_to "/system_tickets/#{@record[:id]}"
            else
                render :new, status: :unprocessable_entity
            end
    end
end
