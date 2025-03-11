class SystemTicketsController < ApplicationController
    before_action :authenticate_user!
    skip_forgery_protection
    
    def index
        @tickets = SystemTicket.all
        @computer_systems = []
        @tickets.each do |x|
            temp=ComputerSystem.find(x.computer_system_id)
            @computer_systems.push([temp.name,x.id])
        end
        @subheader_side_actions = [
            {
              id: "btn-new",
              link: "/new_system_ticket/",
              class: "fa fa-plus",
              text: "New"
            }
          ]
    end

    def selected_index

        system_tix =SystemTicketDesc.where(system_ticket_id:params[:id]).order("created_at DESC")
        @system_name=ComputerSystem.find(SystemTicket.find(params[:id]).computer_system_id).name
        @system_tix_desc=[]
        @milestones=[]

        pending=[]
        active=[]
        processing=[]
        done=[]

        # Filter
        @f_date        = params[:f_date].to_s
        @f_status      = params[:f_status]
            
        if @f_status.present?
            system_tix= system_tix.where(status:@f_status)
        end
        if @f_date.present?
            temp= system_tix
            system_tix=[]
            temp.each do |x|
                if SystemTicketDesc.find(SystemTicketDesc.select(:id).where(system_ticket_id:x[:id]))[:date_received].to_s==@f_date
                    system_tix.push(x)
                end
            end
        end

        if system_tix!=nil then
            system_tix.each do |x|  
                id      =x[:id]
                tixno   =x[:ticket_number]
                date    =x[:date_received]
                sdate   =x[:start_date]
                edate   ="--"
                reqt    =x[:request_type]
                reqn    ="#{User.find(x[:requested_by]).last_name}, #{User.find(x[:requested_by]).first_name}"
                md      ="Not yet set."
                stat    =x[:status]
                

                if x[:data]["save_details"]!=nil
                    if x[:data]["save_details"].length==3
                        then edate=x[:data]["save_details"][2]["date"].to_s[0,10]
                    end
                end

                x[:data]["team_members"].each do |x|
                    if x[1]=="Main Dev"
                        then md="#{User.find(x[0]).last_name}, #{User.find(x[0]).first_name}"
                    end
                end

                if sdate==nil 
                    then sdate="Not yet set." 
                end
    
                case stat
                when "pending"
                    pending.push([id,tixno,date,sdate,edate,reqt,reqn,md,stat])
                when "active"
                    active.push([id,tixno,date,sdate,edate,reqt,reqn,md,stat])
                when "processing"
                    processing.push([id,tixno,date,sdate,edate,reqt,reqn,md,stat])
                when "done"
                    done.push([id,tixno,date,sdate,edate,reqt,reqn,md,stat])
                end
            end
        end

        pending.each do |x|
            @system_tix_desc.push(x)
        end

        active.each do |x|
            @system_tix_desc.push(x)
        end

        processing.each do |x|
            @system_tix_desc.push(x)
        end

        done.each do |x|
            @system_tix_desc.push(x)
        end
        
        puts @system_tix_desc

        @subheader_side_actions = [
            {
              id: "btn-new",
              link: "/new_system_ticket/#{params[:id]}",
              class: "fa fa-plus",
              text: "New",
              data: {id:"asdasd"}
            }
          ]

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
        all_u = User.all
        @not_a_mem=[]
        @milestones=[]
        @ticket   = SystemTicketDesc.find(params[:id])
        @cs_id    = SystemTicket.find(@ticket[:system_ticket_id])[:computer_system_id]
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
        set_md= @ticket.data["team_members"]
        @mem_list= []
        @maindev= ""
        set_md.each do |x|
            if x[1]!="Main Dev"
                @mem_list.push(["#{User.find(x[0])[:last_name].to_s}, #{User.find(x[0])[:first_name].to_s}",x[1],x[0]])
            else
                @maindev = "#{User.find(x[0])[:last_name]}, #{User.find(x[0])[:first_name].to_s}"
            end
        end

        all_u.each do |x|
            temp=0
            @ticket.data["team_members"].each do |y|
                if x.id.to_s==y[0] then temp+=1
                end
            end
            if temp==0 then @not_a_mem.push(["#{x.last_name}, #{x.first_name}",x.id])
            end
        end

    end

    def edit_ticket_status
        edit_tixdesc=SystemTicketDesc.find(params[:id])
        edit_tix=SystemTicket.find(edit_tixdesc[:system_ticket_id])
        new_status= ""

        case edit_tixdesc[:status]
            when "pending"
                new_status= "active"
            when "active"
                new_status= "processing"
            when "processing"
                new_status= "done"
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

        if edit_milestone.update(status:"done",end_date:DateTime.now())
            redirect_to "/system_tickets/#{edit_milestone[:system_ticket_desc_id]}"
        else
            render :edit, status: :unprocessable_entity
        end
    end

    def set_date_milestone
        edit_milestone=Milestone.find(params[:id])

        if edit_milestone.update(start_date:params[:date])
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

    # def set_expected_goal
    #     add_goal=SystemTicketDesc.find(params[:id])

    #     if add_goal.update(expected_goal:params[:goal])
    #         redirect_to "/system_tickets/#{params[:id]}"
    #     else
    #         render :edit, status: :unprocessable_entity
    #     end
    # end

    def add_member
        puts params
        mem_add= SystemTicketDesc.find(params[:id])
        mem_add_data= mem_add[:data]

        puts "pumasok1"
        mem_add_data["team_members"].push([params[:new_mem],params[:task]])
        puts "pumasok2"

        puts mem_add_data

        if mem_add.update(data:mem_add_data)
            redirect_to "/system_tickets/#{params[:id]}"
        else
            render :edit, status: :unprocessable_entity
        end

    end

    def edit_member
        edit_data_mem= SystemTicketDesc.find(params[:id])
        edit_data_mem_data=edit_data_mem[:data]

        lo0p=edit_data_mem_data["team_members"].count
        i=0

        while i <= lo0p
            edit_data_mem_data["team_members"].each do |x|
                if x[0].to_s==params["o-#{i}"].to_s && x[1]!="Main Dev"
                    if params["t-#{i}"]==nil then x[1]=params[:task] 
                    else x[1]=params["t-#{i}"]
                    end 
                end
            end
            i+=1
        end

        puts edit_data_mem_data

        if edit_data_mem.update(data:edit_data_mem_data)
            redirect_to "/system_tickets/#{params[:id]}"
        else
            render :edit, status: :unprocessable_entity
        end

    end

    def delete_member
        puts params
        mem_delete= SystemTicketDesc.find(params[:id])
        mem_delete_data= mem_delete[:data]

        lo0p=mem_delete_data["team_members"].count-1
        i=0

        while i <= lo0p
            mem_delete_data["team_members"].each do |x|
                if x[1].to_s!="Main Dev"
                    if params[:button]==params["d-#{i}"]
                        then mem_delete_data["team_members"].delete(x)
                    end
                    i+=1
                end
            end
        end

        puts mem_delete_data["team_members"]

        if mem_delete.update(data:mem_delete_data)
            redirect_to "/system_tickets/#{params[:id]}"
        else
            render :edit, status: :unprocessable_entity
        end
    end

    def set_maindev
        mem_list_update= SystemTicketDesc.find(params[:id])
        mem_list_update_data= mem_list_update[:data]
        
        mem_list_update_data["team_members"].each do |x|
            puts x[0]
            puts "space"
            if x[1].to_s=="Main Dev"
                then x[1]="Member"
            end
            if x[0].to_s==params[:maindev].to_s
                then x[1]="Main Dev"
            end
            puts "end"
        end

        puts mem_list_update_data["team_members"]

        if mem_list_update.update(data:mem_list_update_data)
            redirect_to "/system_tickets/#{params[:id]}"
        else
            render :edit, status: :unprocessable_entity
        end
    end
end