class SystemTicketsController < ApplicationController
    before_action :authenticate_user!
    def index
        system_tix =SystemTicket.all.order("id DESC")

        @system_tix_desc=[]

        system_tix.each do |x|

            temp    =SystemTicketDesc.where(system_ticket_id:x[:id])[0]
            puts "lld"
            puts x[:id]
            puts temp
            puts SystemTicketDesc.where(system_ticket_id:"b4e4c3d2-5e7c-4cf8-9153-a6ed6b0bc2d2")[0]
            puts "lll" 
            puts temp

            tixno   =temp[:ticket_number]
            stat    =temp[:status]
            date    =temp[:date_received]
            title   =temp[:title]
            id      =temp[:id]
            # cs_name =ComputerSystem.find(x[:computer_system_id])[:name]
            cs_name =nil

            @system_tix_desc.push([tixno,stat,date,cs_name,title,id])

        end
    end

    def create_systemtix
        @record     =SystemTicket.new(
                                        computer_system_id:nil,
                                        status:'pending',
                                        user_id:nil
                                     )
        if @record.save
           @record2=SystemTicketDesc.new(
                ticket_number:nil,
                system_ticket_id:@record[:id],
                system_type:nil,
                title:params[:title],
                description:params[:description],
                status:"pending",
                data:   {
                            team_members:nil,
                            attached_file:params[:file],
                            save_details:nil
                        },
                date_received:DateTime.now(),
                start_date:nil,
                expected_goal:nil
            )
            if @record2.save
                redirect_to @record
            else
                render :new, status: :unprocessable_entity
            end
        end
    end


    def show
        # @record = SystemTicketDesc.where(system_ticket_id:params[:id])
    end

end