class ProcessReceiveMemberApi < ApplicationJob
  queue_as :default

  def perform(members)
    # Process the JSON data
    @members = []
    config = {}
    @counter_update = 0
    @counter_save = 0
    @counter_invalid = 0

    members.each do |m|
      @member_data  = {}
      @member_data[:center_id]                    = m["center_id"]
      @member_data[:branch_id]                    = m["branch_id"]
      @member_data[:first_name]                   = m["first_name"]
      @member_data[:middle_name]                  = m["middle_name"]
      @member_data[:last_name]                    = m["last_name"]
      @member_data[:gender]                       = m["gender"]
      @member_data[:date_of_birth]                = m["date_of_birth"]
      @member_data[:civil_status]                 = m["civil_status"]
      @member_data[:home_number]                  = m["home_number"]
      @member_data[:mobile_number]                = m["mobile_number"]
      @member_data[:processed_by]                 = m["processed_by"]
      @member_data[:approved_by]                  = m["approved_by"]
      @member_data[:identification_number]        = m["identification_number"]
      @member_data[:place_of_birth]               = m["place_of_birth"]     
      @member_data[:status]                       = m["status"]
      @member_data[:member_type]                  = m["member_type"]
      @member_data[:religion]                     = m["religion"]
      @member_data[:insurance_status]             = m["insurance_status"]
      @member_data[:data]                         = m["data"]
      @member_data[:date_resigned]                = m["date_resigned"]
      @member_data[:meta]                         = m["meta"]
      @member_data[:created_at]                   = m["created_at"]
      @member_data[:updated_at]                   = m["updated_at"]
      @member_data[:access_token]                 = m["access_token"]
      @member_data[:signature_data]               = m["signature_data"]
      @member_data[:modifiable]                   = m["modifiable"]
      @member_data[:previous_date_resigned]       = m["previous_date_resignedd"]
      @member_data[:insurance_date_resigned]      = m["insurance_date_resigned"]
      @member_data[:member_id]                    = m["member_id"]
      @member_data[:encrypted_password]           = m["encrypted_password"]
      @member_data[:username]                     = m["username"]
      @member_data[:online_application_id]        = m["online_application_id"]
      @member_data[:membership_arrangement_id]    = m["membership_arrangement_id"]
      @member_data[:membership_type_id]           = m["membership_type_id"]
      @member_data[:referrer_id]                  = m["referrer_id"]
      @member_data[:coordinator_id]               = m["coordinator_id"]
      @member_data[:email]                        = m["email"]
      @member_data[:external_ref]                 = m["external_ref"]


      @members << @member_data 

      config = @members.map{ |o|
        {
          center_id: o[:center_id],
          branch_id: o[:branch_id],
          first_name: o[:first_name],
          middle_name: o[:middle_name],
          last_name: o[:last_name],
          gender: o[:gender],
          date_of_birth: o[:date_of_birth],
          civil_status: o[:civil_status],
          home_number: o[:home_number],
          mobile_number: o[:mobile_number],
          processed_by: o[:processed_by],
          approved_by: o[:approved_by],
          identification_number: o[:identification_number],
          place_of_birth: o[:place_of_birth],
          status: o[:status],
          member_type: o[:member_type],
          religion: o[:religion],
          insurance_status: o[:insurance_status],
          data: o[:data],
          date_resigned: o[:date_resigned],
          meta: o[:meta],
          created_at: o[:created_at],
          updated_at: o[:update_at],
          access_token: o[:access_token],
          signature_data: o[:signature_data],
          modifiable: o[:modifiable],
          previous_date_resigned: o[:previous_date_resigned],
          insurance_date_resigned: o[:insurance_date_resigned],
          member_id: o[:member_id],
          encrypted_password: o[:encrypted_password],
          username: o[:username],
          online_application_id: o[:online_application_id],
          membership_arrangement_id: o[:membership_arrangement_id],
          membership_type_id: o[:membership_type_id],
          referrer_id: o[:referrer_id],
          coordinator_id: o[:coordinator_id],
          email: o[:email],
          external_ref: o[:external_ref]
        }
      }
    end

    @config = config 

    config.each do |a|
      member_insurance_status         = Member.where(insurance_status: a[:insurance_status])
      member_external_ref             = Member.where(external_ref: a[:external_ref])
      member_identification_number    = Member.where(identification_number: a[:identification_number])

      if member_identification_number.count > 0 && member_external_ref.count > 0
        member_data = {
          center_id: a[:center_id],
          branch_id: a[:branch_id],
          first_name: a[:first_name],
          middle_name: a[:middle_name],
          last_name: a[:last_name],
          gender: a[:gender],
          date_of_birth: a[:date_of_birth],
          civil_status: a[:civil_status],
          home_number: a[:home_number],
          mobile_number: a[:mobile_number],
          processed_by: a[:processed_by],
          approved_by: a[:approved_by],
          identification_number: a[:identification_number],
          place_of_birth: a[:place_of_birth],
          status: a[:status],
          member_type: a[:member_type],
          religion: a[:religion],
          insurance_status: a[:insurance_status],
          data: a[:data],
          date_resigned: a[:date_resigned],
          meta: a[:meta],
          created_at: a[:created_at],
          updated_at: a[:update_at],
          access_token: a[:access_token],
          signature_data: a[:signature_data],
          modifiable: a[:modifiable],
          previous_date_resigned: a[:previous_date_resigned],
          insurance_date_resigned: a[:insurance_date_resigned],
          member_id: a[:member_id],
          encrypted_password: a[:encrypted_password],
          username: a[:username],
          online_application_id: a[:online_application_id],
          membership_arrangement_id: a[:membership_arrangement_id],
          membership_type_id: a[:membership_type_id],
          referrer_id: a[:referrer_id],
          coordinator_id: a[:coordinator_id],
          email: a[:email],
          external_ref: a[:external_ref]
        }
        cmd = ::Kmba::UpdateMembers.new(
            member_data: member_data
          ).execute!
        @counter_update +=1
      else 
        member_data = {
          center_id: a[:center_id],
          branch_id: a[:branch_id],
          first_name: a[:first_name],
          middle_name: a[:middle_name],
          last_name: a[:last_name],
          gender: a[:gender],
          date_of_birth: a[:date_of_birth],
          civil_status: a[:civil_status],
          home_number: a[:home_number],
          mobile_number: a[:mobile_number],
          processed_by: a[:processed_by],
          approved_by: a[:approved_by],
          identification_number: a[:identification_number],
          place_of_birth: a[:place_of_birth],
          status: a[:status],
          member_type: a[:member_type],
          religion: a[:religion],
          insurance_status: a[:insurance_status],
          data: a[:data],
          date_resigned: a[:date_resigned],
          meta: a[:meta],
          created_at: a[:created_at],
          updated_at: a[:update_at],
          access_token: a[:access_token],
          signature_data: a[:signature_data],
          modifiable: a[:modifiable],
          previous_date_resigned: a[:previous_date_resigned],
          insurance_date_resigned: a[:insurance_date_resigned],
          member_id: a[:member_id],
          encrypted_password: a[:encrypted_password],
          username: a[:username],
          online_application_id: a[:online_application_id],
          membership_arrangement_id: a[:membership_arrangement_id],
          membership_type_id: a[:membership_type_id],
          referrer_id: a[:referrer_id],
          coordinator_id: a[:coordinator_id],
          email: a[:email],
          external_ref: a[:external_ref]
        }
            
        cmd = ::Kmba::SaveMembers.new(
            member_data: member_data
          ).execute!
        @counter_save +=1

      end
    end

    if @counter_save > 0 and @counter_update > 0
      puts "status: 200, Code: KMBA-002 - KMBA-003, Uploaded: #{@counter_save}", Updated: "#{@counter_update}"
    elsif @counter_save > 0
      puts "status: 201, Code: KMBA-002, Uploaded: #{@counter_save}"
    elsif @counter_update > 0
      puts "status: 200, Code: KMBA-003, Updated: #{@counter_update}"
    end
  end
end
