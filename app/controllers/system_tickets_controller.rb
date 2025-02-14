class SystemTicketsController < ApplicationController
    before_action :authenticate_user!

    def index
        system_tix =SystemTicket.all.order("created_at DESC")

        @system_tix_desc=[]
        @milestones=[]

        # Filter
      @f_cs          = params[:f_cs]
      @f_date        = params[:f_date].to_s
      @f_status      = params[:f_status]

      if @f_cs.present?
        system_tix = system_tix.where(computer_system_id:@f_cs)
      end

      if @f_status.present?
        system_tix = system_tix.where(status:@f_status)
      end

      if @f_date.present?
        temp=system_tix
        system_tix=[]
        temp.each do |x|
            if SystemTicketDesc.find(SystemTicketDesc.select(:id).where(system_ticket_id:x[:id]))[:date_received].to_s==@f_date
                system_tix.push(x)
            end
        end
      end

      if system_tix!=nil then
        system_tix.each do |x|
            temp    =SystemTicketDesc.find(SystemTicketDesc.select(:id).where(system_ticket_id:x[:id]))

            tixno   =temp[:ticket_number]
            stat    =temp[:status]
            stat_n  =0
            date    =temp[:date_received]
            title   =temp[:title]
            id      =temp[:id]
            cs_name =ComputerSystem.find(x[:computer_system_id])[:name]

            case stat
            when "pending"
                stat_n=1
            when "active"
                stat_n=2
            when "processing"
                stat_n=3
            when "done"
                stat_n=4
            end

            @system_tix_desc.push([stat_n,[tixno,stat,date,cs_name,title,id]])
        end
      end
        @system_tix_desc.sort!    
    end
    
    def create_systemtix
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
                title:params[:title],
                description:params[:description],
                status:"pending",
                data:   {
                            team_members:nil,
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

    def create_milestone
        puts params[:id]
        @record=Milestone.new(
                        system_ticket_desc_id:params[:id],
                        milestone_details:params[:details],
                        status:'pending',
                        target_date:params[:date]
                      )
        if @record.save
            redirect_to "/system_tickets/#{@record[:system_ticket_desc_id]}"
        else
            render :new, status: :unprocessable_entity
        end
    end

    def show
        @milestones=[]
        @ticket   = SystemTicketDesc.find(params[:id])
        @empty    = Milestone.where(system_ticket_desc_id:@ticket[:id]).count==0
        if !@empty then @milestones=Milestone.where(system_ticket_desc_id:@ticket[:id]).order("status DESC,target_date ASC") end
            # if @ticket[:data]["attached_file"]!=nil then @file=@ticket[:data]["attached_file"]["tempfile"] end
            #     if @file.is_a?(StringIO)
            #         @file2 = Tempfile.new
            #         File.write(@file2.path, @file2.string)
            #     end
            
        # if @ticket[:data]["attached_file"]!=nil then @file=@ticket[:data]["attached_file"].attachment_url end
        #     puts "file_try"
        #     render json: @file
    end

    def edit_ticket_status
        edit_tixdesc=SystemTicketDesc.find(params[:id])
        edit_tix=SystemTicket.find(edit_tixdesc[:system_ticket_id])
        new_status=""

        case edit_tixdesc[:status]
            when "pending"
                new_status="active"
            when "active"
                new_status="processing"
            when "processing"
                new_status="done"
        end

        edit_tixdesc[:status]=new_status
        edit_tix[:status]=new_status

        if edit_tixdesc[:data]["save_details"]== nil then edit_tixdesc[:data]["save_details"]=["status"=>new_status,"date"=>DateTime.now()]
            else edit_tixdesc[:data]["save_details"].push({"status"=>new_status,"date"=>DateTime.now()})
        end

        if edit_tixdesc.update(status:new_status)
            if edit_tix.update(status:new_status)
                redirect_to "/system_tickets/#{edit_tixdesc[:id]}"
            else
                render :edit, status: :unprocessable_entity
            end
        end
    end 

    def edit_milestone
        edit_milestone=Milestone.find(params[:id])

        if edit_milestone.update(status:"done")
            redirect_to "/system_tickets/#{edit_milestone[:system_ticket_desc_id]}"
        else
            render :edit, status: :unprocessable_entity
        end
    end

    def set_start_date
        edit_date=SystemTicketDesc.find(params[:id])

        if edit_date.update(start_date:params[:date])
            redirect_to "/system_tickets/#{params[:id]}"
        else
            render :edit, status: :unprocessable_entity
        end
    end

    def set_expected_goal
        add_goal=SystemTicketDesc.find(params[:id])

        if add_goal.update(expected_goal:params[:goal])
            redirect_to "/system_tickets/#{params[:id]}"
        else
            render :edit, status: :unprocessable_entity
        end
    end

    def add_member
    end

    def delete_member
    end

    def set_maindev
    end

end