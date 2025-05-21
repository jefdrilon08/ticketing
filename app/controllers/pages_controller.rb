class PagesController < ApplicationController
  include ApplicationHelper

  before_action :authenticate_user!, except: [:login, :forgot_password, :ping]

  def ping
    render json: { message: "pong" }
  end

  def index
    @payload = {
      token: current_user.generate_jwt,
      username: current_user.username,
      roles: current_user.roles,
      is_microinsurance: Settings.activate_microinsurance,
      urlGenerateDailyReport: "#{ENV['BACKEND_API_URL']}/api/v2/dashboard/generate_daily_report",
      urlGenerateAccountingReport: "#{ENV['BACKEND_API_URL']}/api/v2/dashboard/generate_accounting_report",
      userId: current_user.id,
      xKoinsAppAuthSecret: ENV['KOINS_APP_AUTH_SECRET']
    }

    @subheader_items = [
      { text: "Operations" }
    ]

    @systemtix=[]
    @openhigh=[]
    @openmed=[]
    @openlow=[]

    @duetoday=[]
    @overdue=[]
    @upcoming=[]

    @ontime=[]
    @late=[]

    @today=[]

    SystemTicket.all.each do |x|
      x.data["team_members"].each do |y|
        status=SystemTicketsUser.where(system_ticket_id:x.id,user_id:y)[0].status=="active" || SystemTicketsUser.where(system_ticket_id:x.id,user_id:y)[0].status=="admin"
        if current_user.id==y && status then @systemtix.push(x) end
      end
    end

    SystemTicketDesc.all.each do |x|
      if x.status!='done'
        if x.data["category"]=='high' && x.status!='done'
          then @openhigh.push(x)
        elsif x.data["category"]=='medium' && x.status!='done'
          then @openmed.push(x)
        elsif x.data["category"]=='low' && x.status!='done'
          then @openlow.push(x)
        end
        if DateTime.current.to_date==x.target_date
          then @duetoday.push(x)
        elsif DateTime.current.to_date<x.target_date
          then @upcoming.push(x)
        elsif DateTime.current.to_date>x.target_date
          then @overdue.push(x)
        end
      else
        if x.data["save_details"][3]["date"].to_date<=x.target_date
          then @ontime.push(x)
        elsif x.data["save_details"][3]["date"].to_date>x.target_date
          then @late.push(x)
        end

        if x.status=='done'
          if x.data["save_details"][3]["date"].to_date==DateTime.current.to_date then @today.push(x)
          end
        end
      end
    end

    developers = []
    dev_grp = []

    SystemTicketsUser.all.each do |x|
      if x.role=="Developer" && x.status=="active" then developers.push(x)
      end
    end

    developers.each do |x|
      if dev_grp.empty? then dev_grp.push([x])
      else
        temp=0
        dev_grp.each do |y|
          if y[0].user_id==x.user_id 
            y.push(x)
            temp+=1
          end
        end
        if temp==0 then dev_grp.push([x])
        end
      end
    end

    @labels=[]
    @chart_data=[]

    dev_grp.each do |x|
      @labels.push("#{User.find(x[0].user_id).last_name}, #{User.find(x[0].user_id).first_name}")
    end

    @tix_list=[]

    SystemTicket.all.each do |x|
      temp=[]
      temp2=[]
      temp3=[]
      dev_grp.each do |y|
          is_member=false
          y.each do |z|
              if x.data["team_members"].include? z.user_id
                  is_member=true
                  SystemTicketDesc.where(system_ticket_id:x.id).each do |a|
                    temp_tix=[]
                    is_member2=false
                      ticket_no=a.ticket_number
                      start=''
                      end_='open'
                      a.data["team_members"].each do |b|
                        if b[0]==z.id
                          is_member2=true
                              start=a.created_at.to_s[0..9]
                              if a.status=='done'
                                  end_=a.data["save_details"][3]["date"].to_s[0..9]
                              end 
                        end
                      end
                      if is_member2
                        temp.push([start,end_])
                      end
                  end
              end
          end
          if is_member
              temp2.push(temp)
          else
              temp2.push([])
          end
          temp=[]
      end
      if ComputerSystem.where(id:x.computer_system_id).exists?
        then @tix_list.push([ComputerSystem.find(x.computer_system_id).name,temp2])
      end
    end

    # render json: {message:@tix_list}

    @list_due_today=SystemTicketDesc.where(target_date:DateTime.current.to_date)

    if !@list_due_today.empty? 
      if @list_due_today.count>=3
        then @list_due_today=@list_due_today.last(3)
      elsif @list_due_today.count==2
        then @list_due_today=@list_due_today.last(2)
      elsif @list_due_today.count==1
        then @list_due_today=[@list_due_today[0]]
      end
    else
      @list_due_today=nil
    end

    # @final_data=[]

    # @chart_data.each do |x|
    #   @final_data.push(
    #     {
    #       'label'=>"#{x[0]} - Open",
    #       'data'=>x[1],
    #       'stack'=>'Stack 0'
    #     }
    #   )
    #   @final_data.push(
    #     {
    #       'label'=>"#{x[0]} - Closed",
    #       'data'=>x[2],
    #       'stack'=>'Stack 1'
    #     }
    #   )
    # end
    # @final_data=@final_data.to_json
  end

  def change_password
    @subheader_items = [
      { text: "Change Password" }
    ]
  end

  def forgot_password
    verification_token = params[:verification_token]

    if verification_token.blank?
      redirect_to root_path
    else
      @user = User.find_by_verification_token(verification_token)

      if @user.blank?
        redirect_to root_path
      else
        @payload = {
          verification_token: verification_token
        }

        render 'pages/forgot_password', layout: 'plain'
      end
    end
  end

  def profile
  end

  def download_backup
    if user_signed_in? and current_user.roles.include?("MIS")
      destination_directory = "#{Rails.root}/db_backup"
      filename = "#{Time.now.to_i}-backup-#{ENV['RAILS_ENV'] ||= 'development'}.dump"
      destination_file = "#{destination_directory}/#{filename}"

      pw = ::ActiveRecord::Base.connection_db_config.configuration_hash[:password]
      host = ::ActiveRecord::Base.connection_db_config.configuration_hash[:host]
      username = ::ActiveRecord::Base.connection_db_config.configuration_hash[:username]
      db = ::ActiveRecord::Base.connection_db_config.configuration_hash[:database]

      cmd = "PGPASSWORD=#{pw} pg_dump --host #{host} --username #{username} --verbose --clean --no-owner --no-acl --format=c #{db} > #{destination_file}"
      `#{cmd}`
      send_file destination_file, filename: filename
    else
      redirect_to root_path
    end
  end

  def download_file
    filename = params[:filename]
    destination_file = "#{Rails.root}/tmp/#{filename}"

    send_file destination_file, filename: filename
  end

  def finance
    render "dashboard/finance"
  end

  def blip_summary
    @branches = Branch.all
    @as_of = params[:as_of].try(:to_date) || Date.today

    @records = Pages::BuildClaimsCounts.new(branches: @branches, as_of: @as_of).execute!
  end

  def insights
    @end_date   = Date.today
    @start_date = @end_date - 7.days
  end

  def login
    @payload = {
      is_microloans: microloans?,
      is_microinsurance: microinsurance?
    }
    render 'pages/login', layout: 'plain'
  end


  def export_tools
    @subheader_items = [
      { text: "Export Tools" }
    ]
  end

  def billing_per_center
    @centers  = @branches.first.centers.order("name ASC")

    @subheader_items = [
      { text: "Billing Per Center" }
    ]
  end

  def upload_deposit
    @subheader_items = [
      { text: "Upload Insurance Deposit" }
    ]
  end

  def upload_insurance_withdrawal
    @subheader_items = [
      { text: "Upload Insurance Withdrawal" }
    ]
  end

  def upload_fund_transfer
    @subheader_items = [
      { text: "Upload Fund Transfer" }
    ]
  end

  def upload_clip
    @subheader_items = [
      { text: "Upload CLIP" }
    ]
  end

  def import_members
    @subheader_items = [
      { text: "Import Members" }
    ]
  end

  def import_beneficiaries
    @subheader_items = [
      { text: "Import Beneficiaries" }
    ]
  end

  def import_legal_dependents
    @subheader_items = [
      { text: "Import Legal Dependents" }
    ]
  end

  def import_insurance_accounts
    @subheader_items = [
      { text: "Import Insurance Accounts" }
    ]
  end

  def import_insurance_account_transactions
    @records  = DataStore.import_insurance_account_transactions.order("created_at DESC").page(params[:page]).per(35)

    @subheader_items = [
      { text: "Import Insurance Account Transactions" }
    ]
  end

  def seriatim
    @subheader_items = [
      {
        text: "Seriatim Report"
      }
    ]

    @subheader_side_actions = []
  end

  def seriatim_report
    branch = params[:branch]
    as_of = params[:as_of]
  
    excel = Reports::GenerateSeriatimReportExcel.new(
                                                branch: branch,
                                                as_of: as_of
                                                ).execute!

    filename  = "seriatim_report.xlsx"

    excel.serialize "#{Rails.root}/tmp/#{filename}"
    send_file "#{Rails.root}/tmp/#{filename}", filename: "#{filename}", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  end

  def validations
    @subheader_items = [
      {
        text: "Validations Report"
      }
    ]

    @subheader_side_actions = []
  end

  def validations_report
    branch = params[:branch]
    status = params[:status]
    start_date = params[:start_date]
    end_date = params[:end_date]
  
    excel = MemberAccountValidations::GenerateValidationsReportExcel.new(
                                                branch: branch,
                                                status: status,
                                                start_date: start_date,
                                                end_date: end_date
                                                ).execute!

    filename  = "#{status}_validations_report.xlsx"

    excel.serialize "#{Rails.root}/tmp/#{filename}"
    send_file "#{Rails.root}/tmp/#{filename}", filename: "#{filename}", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  end

  def daily_report_insurance_account_status
    @subheader_items = [
      {
        text: "Insurance Account Status"
      }
    ]

    @subheader_side_actions = []
  end

  def daily_report_insurance_account_status_excel
    @branch = params[:branch]
    @insurance_status = params[:insurance_status]

    excel = Pages::GenerateDailyReportInsuranceAccountStatus.new(
                                                  branch: @branch,
                                                  insurance_status: @insurance_status
                                                ).execute!

    filename  = "insurance_account_status.xlsx"

    excel.serialize "#{Rails.root}/tmp/#{filename}"
    send_file "#{Rails.root}/tmp/#{filename}", filename: "#{filename}", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  end
end
