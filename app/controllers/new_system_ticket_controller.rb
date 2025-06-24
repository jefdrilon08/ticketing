class NewSystemTicketController < ApplicationController
    before_action :authenticate_user!
        # cs_name = ComputerSystem.find(params[:id]).name

    def create_systemtix2
        members_arr=[]
        options_arr=[]

        options_arr=params[:options].split(",")

        options_arr.each do |x|
            x=x.strip!
        end

        members_arr.push(current_user.id)
        params[:members].each do|x|
            members_arr.push(x)
        end
        @record     =SystemTicket.new(
                                        computer_system_id:params[:computer_system_id],
                                        status:'pending',
                                        user_id:current_user.id,
                                        data:   {
                                                    team_members:members_arr,
                                                    options_for_select:options_arr,
                                                },
                                        system_number:SystemTicket.all.count+1,
                                        is_private:params[:is_private]
                                    ).save

        members_arr.each do|x|
            if x==current_user.id
                SystemTicketsUser.new(
                                        user_id:x,
                                        status:"admin",
                                        role:"Admin",
                                        system_ticket_id:SystemTicket.where(computer_system_id:params[:computer_system_id])[0].id
                                    ).save
            else
                SystemTicketsUser.new(
                                        user_id:x,
                                        status:"active",
                                        role:"Viewer",
                                        system_ticket_id:SystemTicket.where(computer_system_id:params[:computer_system_id])[0].id
                                    ).save
            end
        end
            redirect_to "/system_tickets/"
    end

    def create_systemtix
        puts params

        main_dev=SystemTicketsUser.where(status:"admin",system_ticket_id:params[:id])[0].id

        if SystemTicketDesc.where(system_ticket_id:params[:id]).count==0 
            tktno=1
            tn_fin="ST#{SystemTicket.find(params[:id]).system_number}-#{tktno}"
        else
            if SystemTicketDesc.where(system_ticket_id:params[:id]).order("created_at DESC")[0].data["ticket_count"].present?
                tktno=SystemTicketDesc.where(system_ticket_id:params[:id]).order("created_at DESC")[0].data["ticket_count"]
                tktno+=1
                tn_fin="ST#{SystemTicket.find(params[:id]).system_number}-#{tktno}"
            else 
                tktno=SystemTicketDesc.where(system_ticket_id:params[:id]).order("created_at DESC").count
                tktno+=1
                tn_fin="ST#{SystemTicket.find(params[:id]).system_number}-#{tktno}"
            end
        end

        file_arr=[]
        
        if SystemTicket.find(params[:id]).data["default_milestones"].present?
        then milestones=SystemTicket.find(params[:id]).data["default_milestones"]
        end

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
                            team_members:[[main_dev,"Main Dev"]],
                            save_details:nil,
                            on_hold:false,
                            hold_details:nil,
                            file:file_arr,
                            category:params[:category],
                            chat:[],
                            ticket_count:tktno
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
                            team_members:[[main_dev,"Main Dev"]],
                            save_details:nil,
                            on_hold:false,
                            hold_details:nil,
                            file:file_arr,
                            category:params[:category],
                            chat:[],
                            ticket_count:tktno
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
        
        if !milestones.empty?
            milestones.each do |x|
                @ms=Milestone.new(
                            system_ticket_desc_id:@record.id,
                            milestone_details:x[1],
                            status:'pending',
                            assigned_person:main_dev,
                            target_date:params[:date]
                        )
                @ms.save!
            end
        end
    end
end
