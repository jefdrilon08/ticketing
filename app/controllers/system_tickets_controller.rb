class SystemTicketsController < ApplicationController
    before_action :authenticate_user!
    skip_forgery_protection
    
    def index
        
        @tickets_all=ComputerSystem.all

        temp= ""
        @q = params[:q]

        if @q.present?
            @tickets_all = @tickets_all.where(
              "upper(name) LIKE :q",
              q: "%#{@q.upcase}%"
            )
          end

        @tickets = []
        @tickets_all.each do |x|
            @tickets.push(x)
        end


        @final_tix_list = []

        @tickets.each do |x|
            puts "kkkk"
            puts SystemTicket.where(computer_system_id:x.id).empty?
            if SystemTicket.where(computer_system_id:x.id).empty? then @tickets-=[x]
            else 
                is_member=0
                if SystemTicket.where(computer_system_id:x.id)[0].is_private   
                    SystemTicket.where(computer_system_id:x.id)[0].data["team_members"].each do |y|
                        if y==current_user.id.to_s then is_member=is_member+1
                        end
                    end
                    puts "pumasok"
                    if is_member!=0 then @final_tix_list.push(SystemTicket.where(computer_system_id:x.id)[0]) end
                else
                    @final_tix_list.push(SystemTicket.where(computer_system_id:x.id)[0])
                end
            end
        end

        puts "final"
        puts @final_tix_list
        
        @subheader_side_actions = [
            {
              id: "btn-new-2",
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
        @admin=false
        

        if !SystemTicketsUser.where(system_ticket_id:params[:id],user_id:current_user.id).empty? then
            if SystemTicketsUser.where(system_ticket_id:params[:id],user_id:current_user.id)[0].status=="admin"
                then @admin=true
            end
        end

        pending=[]
        approved=[]
        processing=[]
        for_verification=[]
        done=[]

        high=[]
        medium=[]
        low=[]
        uncategorized=[]

        # Filter
        @f_sdate       = params[:f_sdate].to_s
        @f_edate       = params[:f_edate].to_s
        @f_type        = params[:f_type]
        @f_status      = params[:f_status]
        @f_hold        = params[:f_hold]

        if @f_sdate.present?
            temp= system_tix
            system_tix=[]
            temp.each do |x|
                if x[:start_date].to_s==@f_sdate
                    system_tix.push(x)
                end
            end
        end

        if @f_edate.present?
            temp= system_tix
            system_tix=[]
            temp.each do |x|
                if x[:end_date].to_s==@f_edate
                    system_tix.push(x)
                end
            end
        end
            
        if @f_status.present?
            system_tix= system_tix.where(status:@f_status)
        end

        if @f_hold.present?
            temp= system_tix
            system_tix=[]
            temp.each do |x|
                if x.data["on_hold"].to_s==@f_hold
                    system_tix.push(x)
                end
            end
        end

        if @f_type.present?
            system_tix= system_tix.where(request_type:@f_type)
        end

        if system_tix!=nil then
            system_tix.each do |x|  
                id      =x[:id]
                tixno   =x[:ticket_number]
                date    =x[:date_received]
                tdate   =x[:target_date]
                sdate   =x[:start_date]
                edate   = "--"
                reqt    = x[:request_type]
                reqn    = [x[:requested_by],"#{User.find(x[:requested_by]).last_name}, #{User.find(x[:requested_by]).first_name}"]
                md      = "Not yet set."
                stat    = x[:status]
                hold    = x[:data]["on_hold"]
                cat     = "uncategorized"
                read    = false
                is_a_m  = 0

                if x[:data]["save_details"]!=nil
                    if x[:data]["save_details"].length==4
                        then edate=x[:data]["save_details"][3]["date"].to_s[0,10]
                    end
                end

                if x[:data].include? "category" then cat=x[:data]["category"] end

                x[:data]["team_members"].each do |x|
                  if x[1]=="Main Dev"&&(SystemTicketsUser.find(x[0]).status!="inactive") then md=[x[0],"#{User.find(SystemTicketsUser.find(x[0]).user_id).last_name}, #{User.find(SystemTicketsUser.find(x[0]).user_id).first_name}"]
                  end
                  if User.find(SystemTicketsUser.find(x[0]).user_id).id==current_user.id 
                    is_a_m+=1
                    if x[2]
                        then read=true
                    end
                  end
                end

                puts read
                puts "wawawawawa1"

                if x[:data]["chat"].present?
                    if current_user.id==x[:data]["chat"].last()[0] then read=true
                    end
                end
                
                puts read
                puts "wawawawawa2"

                if current_user.id==x.requested_by
                    is_a_m=1 
                    if x.data["read_by_req"] then read=true end
                end

                

                    puts "wawawawawa3"

                if sdate==nil 
                    then sdate="Not yet set." 
                end
                
                case cat
                when "high"
                    high.push([id,tixno,date,sdate,edate,reqt,reqn,md,stat,hold,tdate,cat,read,is_a_m])
                when "medium"
                    medium.push([id,tixno,date,sdate,edate,reqt,reqn,md,stat,hold,tdate,cat,read,is_a_m])
                when "low"
                    low.push([id,tixno,date,sdate,edate,reqt,reqn,md,stat,hold,tdate,cat,read,is_a_m])
                when "uncategorized"
                    uncategorized.push([id,tixno,date,sdate,edate,reqt,reqn,md,stat,hold,tdate,cat,read,is_a_m])
                end

            end
        end

        temp_sorted=[]
        
        high.each do |x|
            temp_sorted.push(x)
        end

        medium.each do |x|
            temp_sorted.push(x)
        end

        low.each do |x|
            temp_sorted.push(x)
        end

        uncategorized.each do |x|
            temp_sorted.push(x)
        end

        temp_sorted.each do |x|
            case x[8]
            when "pending"
                pending.push(x)
            when "approved"
                approved.push(x)
            when "processing"
                processing.push(x)
            when "for verification"
                for_verification.push(x)
            when "done"
                done.push(x)
            end
        end


        pending.each do |x|
            @system_tix_desc.push(x)
        end

        approved.each do |x|
            @system_tix_desc.push(x)
        end

        processing.each do |x|
            @system_tix_desc.push(x)
        end

        for_verification.each do |x|
            @system_tix_desc.push(x)
        end

        done.each do |x|
            @system_tix_desc.push(x)
        end
        
        puts @system_tix_desc

        @subheader_side_actions = [
            {
                id: "btn-new-3",
                link: "/new_system_ticket/#{params[:id]}",
                class: "fa fa-plus",
                text: "New"
            }
        ]

    end

    def show_st
        @system_name=ComputerSystem.find(SystemTicket.find(params[:id]).computer_system_id)[:name]
        @system_id=params[:id]
        puts ""
        @system_members=[]
        @non_system_members=[]
        members=SystemTicketsUser.where(system_ticket_id:params[:id])

        User.order("last_name ASC").all.each do |x|
            @non_system_members.push(x.id)
        end

        User.order("last_name ASC").all.each do |x|
            members.each do |y|
                if x.id.to_s==y.user_id.to_s 
                    then @non_system_members.each do |z|
                        if z==y.user_id.to_s then @non_system_members.delete(z) end
                    end 
                end
            end
        end

        active=[]
        inactive=[]
        pending=[]
        admin=[]

        members.each do |x|
            if x.status=="active" then active.push(x)
            elsif x.status=="inactive" then inactive.push(x)
            elsif x.status=="pending" then pending.push(x)
            elsif x.status=="admin" then admin.push(x)
            end
        end

        @system_members.push(admin[0])

        active.each do |x|
            @system_members.push(x)
        end

        inactive.each do |x|
            @system_members.push(x)
        end

        pending.each do |x|
            @system_members.push(x)
        end
    end

    def hold_ticket
        puts params
        holdtix=SystemTicketDesc.find(params[:id])

        if holdtix[:data]["on_hold"]==true then holdtix[:data]["on_hold"]=false
        else holdtix[:data]["on_hold"]=true
        end

        if holdtix[:data]["hold_details"]==nil then holdtix[:data]["hold_details"]=[[holdtix[:data]["on_hold"],DateTime.now()]]
        else holdtix[:data]["hold_details"].push([holdtix[:data]["on_hold"],DateTime.now()])
        end

        puts "new params"
        puts holdtix
        if holdtix.update(data:holdtix[:data])
            redirect_to "/system_tickets_#{holdtix[:system_ticket_id]}"
        else
            render :edit, status: :unprocessable_entity
        end
    end

    def read_chat
        puts params
        read_chat=SystemTicketDesc.find(params[:id])
        read_chat_data=read_chat.data

        read_chat_data["team_members"].each do |x|
            if SystemTicketsUser.find(x[0]).user_id==current_user.id then x[2]=true end
        end

        if current_user.id==read_chat.requested_by then read_chat_data["read_by_req"]=true end

        read_chat.update!(data:read_chat_data)
            redirect_to "/system_tickets/#{params[:id]}"
    end
    
    def create_milestone
        puts params[:id]
        @record=Milestone.new(
                        system_ticket_desc_id:params[:id],
                        milestone_details:params[:details],
                        status:'pending',
                        assigned_person:params[:dev],
                        target_date:params[:date]
                      )
        if @record.save
            redirect_to "/system_tickets/#{@record[:system_ticket_desc_id]}"
        else
            render :new, status: :unprocessable_entity
        end
    end

    def show
        @role=0
        @all_done=0
        @not_a_mem=[]
        @mem_list_dev=[]
        @milestones=[]
        @chat=SystemTicketDesc.find(params[:id])[:data]["chat"]
        @ticket   = SystemTicketDesc.find(params[:id])
        all_u = SystemTicket.find(@ticket[:system_ticket_id])[:data]["team_members"]
        @cs_id    = SystemTicket.find(@ticket[:system_ticket_id])[:computer_system_id]
        @empty    = Milestone.where(system_ticket_desc_id:@ticket[:id]).count==0
        @id_forchat=params[:id]
        if !@empty then @milestones=Milestone.where(system_ticket_desc_id:@ticket[:id]).order("status DESC,target_date ASC") end
        @milestones.each do |x|
            if x.status=="pending" then @all_done=@all_done+1 end
        end
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
          system_ticket_user = SystemTicketsUser.find_by(id: x[0])
          if system_ticket_user
            user = User.find_by(id: system_ticket_user.user_id)

            if user
              name = "#{user.last_name}, #{user.first_name}"
            else
              name = "Unknown User"
            end
          else
            name = "Unknown SystemTicketsUser"
          end

          if system_ticket_user.status=="active"||system_ticket_user.status=="admin"
            if x[1] != "Main Dev"
                @mem_list.push([name, system_ticket_user.role, system_ticket_user.id])
              else
                @maindev = [name,x[0]]
              end
          end
          
        end
        puts "allu"
        all_u.each do |x|
            puts x
            temp=0
            temp2= ""
            @ticket.data["team_members"].each do |y|
                if x==SystemTicketsUser.find(y[0]).user_id.to_s then temp+=1
                end
                temp2=SystemTicketsUser.where(user_id:x,system_ticket_id:SystemTicketDesc.find(@ticket.id).system_ticket_id)[0].id
            end
            if temp==0 then
                if SystemTicketsUser.find(temp2).status=="active"||SystemTicketsUser.find(temp2).status=="admin"&&SystemTicketsUser.find(temp2).status!="inactive" then
                    @not_a_mem.push(temp2)
                end
            end
        end

        @mem_list.each do |x|
            if current_user.id==SystemTicketsUser.find(x[2]).user_id && SystemTicketsUser.find(x[2]).system_ticket_id==SystemTicketDesc.find(params[:id]).system_ticket_id
                case SystemTicketsUser.find(x[2]).role
                when "Viewer"
                    @role=4
                when "Approver"
                    @role=1
                when "Developer"
                    @role=2
                end
            end
            if SystemTicketsUser.find(x[2]).role=="Developer"||SystemTicketsUser.find(x[2]).role=="Admin"
                then @mem_list_dev.push(x)
            end 
        end

        puts "popopopopo"
        puts @role

        if current_user.id==SystemTicketsUser.find(@maindev[1]).user_id then @role=3 end

        puts "nonmem"
        puts @not_a_mem

        puts "mem"
        puts @mem_list

        if !SystemTicketsUser.where(system_ticket_id:@ticket[:system_ticket_id],user_id:current_user.id).empty? then
            if SystemTicketsUser.where(system_ticket_id:@ticket[:system_ticket_id],user_id:current_user.id)[0].status=="admin" then @role=5 end
            end
        @subheader_side_actions ||= []

        if ["pending"].include?(@ticket.status) && !@ticket.data["on_hold"] 
            if @role==1 || @role==5
                @subheader_side_actions << {
                id: "btn-status",
                link: "edit_ticket_status/#{params[:id]}",
                class: "fa fa-check",
                data: { id: @ticket.id },
                text: "Approve"
                } end
        end

        if ["approved"].include?(@ticket.status) && !@ticket.data["on_hold"] 
            if @role==2 || @role==3 || @role==5
                @subheader_side_actions << {
                id: "btn-status",
                link: "edit_ticket_status/#{params[:id]}",
                class: "fa fa-check",
                data: { id: @ticket.id },
                text: "Process"
                } end
        end

        if ["processing"].include?(@ticket.status) && !@ticket.data["on_hold"]
            if @role==2 || @role==3 || @role==5
            @subheader_side_actions << {
              id: "btn-status",
              link: "edit_ticket_status/#{params[:id]}",
              class: "fa fa-check",
              data: { id: @ticket.id },
              text: "For verification"
            } end
              end

        if ["for verification"].include?(@ticket.status) && !@ticket.data["on_hold"] && @ticket[:start_date]!=nil && @all_done==0
            if @role==1 || @role==5
                @subheader_side_actions << {
                id: "btn-status",
                link: "edit_ticket_status/#{params[:id]}",
                class: "fa fa-check",
                data: { id: @ticket.id },
                text: "Verify"
                } end
        end
  

    end

    def edit_ticket_status
        edit_tixdesc=SystemTicketDesc.find(params[:id])
        edit_tix=SystemTicket.find(edit_tixdesc[:system_ticket_id])
        new_status= ""

        case edit_tixdesc[:status]
            when "pending"
                new_status= "approved"
            when "approved"
                new_status= "processing"
            when "processing"
                new_status= "for verification"
            when "for verification"
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

    def edit_target_date
        edit_date=SystemTicketDesc.find(params[:id])

        if edit_date.update(target_date:params[:date])
            redirect_to "/system_tickets/#{params[:id]}"
        else
            render :edit, status: :unprocessable_entity
        end
    end

    def change_category
        change_category=SystemTicketDesc.find(params[:id])
        change_category_data=change_category.data

        change_category_data["category"]=params[:category]

        change_category.update!(data:change_category.data)
            redirect_to "/system_tickets/#{params[:id]}"
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

        params[:members].each do|x|
            mem_add_data["team_members"].push([x,nil])
        end

        puts mem_add_data

        if mem_add.update(data:mem_add_data)
            redirect_to "/system_tickets/#{params[:id]}"
        else
            render :edit, status: :unprocessable_entity
        end

    end

    def edit_member

        puts params
        edit_data_mem= SystemTicket.find(params[:id])
        edit_data_mem_data=edit_data_mem.data

        lo0p=edit_data_mem_data["team_members"].count
        i=0

        while i <= lo0p
            edit_data_mem_data["team_members"].each do |x|
                temp=SystemTicketsUser.where(user_id:x,system_ticket_id:params[:id])[0]
                if temp.id==params["o-#{i}"].to_s && temp.role!="Main Dev"
                    if params["t-#{i}"]==nil then temp.update(role:params["t-#{i}"])
                    else temp.update(role:params["t-#{i}"])
                    end 
                end
            end
            i+=1
        end

        redirect_to "/system_tickets_#{params[:id]}/edit"

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
                    if x[0]==params["d1-#{x[0]}"]
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
                then x[1]=nil
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

    def add_attachment
        add_att=SystemTicketDesc.find(params[:id])
        add_att_data=add_att[:data]
        file_arr=[]

        params[:file].each do |x|
            file_arr.push(x)
        end

        add_att_data["file"]=file_arr
        
        if add_att.update(data:add_att_data,file:file_arr)
            redirect_to "/system_tickets/#{params[:id]}"
        else
            render :edit, status: :unprocessable_entity
        end
    end

    def edit_attachment
        add_att=SystemTicketDesc.find(params[:id])
        add_att_data=add_att[:data]
        file_arr=[]

        if !SystemTicketDesc.find(params[:id]).file.empty? then
            add_att_data["file"]=[]
            add_att.file=nil
        end

        puts file_arr

        params[:file].each do |x|
            file_arr.push(x)
        end

        add_att_data["file"]=file_arr
        
        if add_att.update(data:add_att_data)
            redirect_to "/system_tickets/#{params[:id]}"
        else
            render :edit, status: :unprocessable_entity
        end
    end


    def edit_member_status
        member=SystemTicketsUser.find(params[:mem_id])
        status= ""

        if params[:status]=="active" then status="inactive"
        else status="active"
        end

        if member.update(status:status)
            redirect_to "/system_tickets_#{SystemTicketsUser.find(params[:mem_id]).system_ticket_id}/edit"
        else
            render :edit, status: :unprocessable_entity
        end
    end

    def add_member_st
        puts params

        mem_add= SystemTicket.find(params[:id])
        mem_add_data= mem_add[:data]

        params[:members].each do|x|
            mem_add_data["team_members"].push(x)
            SystemTicketsUser.new(
                                        user_id:x,
                                        status:"active",
                                        system_ticket_id:params[:id]
                                    ).save
        end

        puts mem_add_data

        if mem_add.update(data:mem_add_data)
            redirect_to "/system_tickets_#{params[:id]}/edit"
        else
            render :edit, status: :unprocessable_entity
        end
    end

    def join_st
        ticket=SystemTicket.find(params[:id])
        ticket_data=ticket[:data]

            SystemTicketsUser.new(
                                    user_id:params[:mem_id],
                                    status:"pending",
                                    system_ticket_id:params[:id]
                                ).save!

        ticket_data["team_members"].push(params[:mem_id])
        if ticket.update(data:ticket_data)
            redirect_to "/system_tickets"
        else
            render :edit, status: :unprocessable_entity
        end
    end

    def make_private
        if SystemTicket.find(params[:id]).is_private then SystemTicket.find(params[:id]).update!(is_private:false)
        else SystemTicket.find(params[:id]).update!(is_private:true)
        end

        redirect_to "/system_tickets_#{params[:id]}/edit"
    end

    def chat

        puts params
        add_msg=SystemTicketDesc.find(params[:id])
        add_msg_data=add_msg.data

        add_msg_data["chat"].push([current_user.id,Time.new.strftime("%A %B %d, %Y %I:%M %p"),params[:msg]])

        add_msg_data["team_members"].each do |x|
            if x.count==3       
                then if SystemTicketsUser.find(x[0]).user_id==current_user.id
                    then x[2]=true
                else x[2]=false
                end
            else
                if SystemTicketsUser.find(x[0]).user_id==current_user.id
                    then x.push(true)
                else x.push(false)
                end
            end
        end

        if current_user.id==add_msg.requested_by
            add_msg_data["read_by_req"]=true 
            add_msg_data["team_members"].each do |x|
                x[2]=false
            end
        else add_msg_data["read_by_req"]=false
        end

        puts add_msg_data["chat"]

        add_msg.update(data:add_msg_data)

        redirect_to "/system_tickets/#{params[:id]}"
    end
end
