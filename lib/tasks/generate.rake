namespace :generate do
  task :cutoff_reports => :environment do
    ProcessCutoffReports.perform_later({})
  end

  task :jef => :environment do
      a = Member.where(branch_id: "339144e0-9544-4a7a-b2d4-b500cc329034")

      puts a.map{ |g| 
                        if  g.data["project_type"].present?
                          f = []
                          f << "#{g.data["project_type"]} | jef"
                          puts f
                        end

                        }
  end


  task :members_file => :environment do
    start_date  = ENV["START_DATE"] || Date.yesterday
    end_date    = ENV["END_DATE"] || Date.tomorrow

    cmd = ::Exports::SaveMembersCsv.new(
            start_date: start_date,
            end_date: end_date
          )

    if cmd.members.any?
      cmd.execute!

      file_repository = cmd.file_repository
      actual_url      = file_repository.actual_url

      api_url = "#{ENV['INSURANCE_KOINS_URL']}/api/v1/members/process_members_file"

      response = HTTParty.get(api_url, { query: { actual_url: actual_url } })

      if response.code.to_s == "200"
        puts "Successfully called MEMBERS API"
      else
        puts "ERROR in calling MEMBERS API"
        puts "api_url: #{api_url}"
        puts "actual_url: #{actual_url}"
      end
    end
  end

  task :beneficiaries_file => :environment do
    start_date  = ENV["START_DATE"] || Date.yesterday
    end_date    = ENV["END_DATE"] || Date.tomorrow

    cmd = ::Exports::SaveBeneficiariesCsv.new(
            start_date: start_date,
            end_date: end_date
          )

    if cmd.beneficiaries.any?
      cmd.execute!

      file_repository = cmd.file_repository
      actual_url      = file_repository.actual_url

      api_url = "#{ENV['INSURANCE_KOINS_URL']}/api/v1/members/process_beneficiaries_file"

      response = HTTParty.get(api_url, { query: { actual_url: actual_url } })

      if response.code.to_s == "200"
        puts "Successfully called MEMBERS API"
      else
        puts "ERROR in calling MEMBERS API"
        puts "api_url: #{api_url}"
        puts "actual_url: #{actual_url}"
      end
    end
  end

  task :legal_dependents_file => :environment do
    start_date  = ENV["START_DATE"] || Date.yesterday
    end_date    = ENV["END_DATE"] || Date.tomorrow

    cmd = ::Exports::SaveLegalDependentsCsv.new(
            start_date: start_date,
            end_date: end_date
          )

    if cmd.legal_dependents.any?
      cmd.execute!

      file_repository = cmd.file_repository
      actual_url      = file_repository.actual_url

      api_url = "#{ENV['INSURANCE_KOINS_URL']}/api/v1/members/process_legal_dependents_file"

      response = HTTParty.get(api_url, { query: { actual_url: actual_url } })

      if response.code.to_s == "200"
        puts "Successfully called MEMBERS API"
      else
        puts "ERROR in calling MEMBERS API"
        puts "api_url: #{api_url}"
        puts "actual_url: #{actual_url}"
      end
    end
  end

  task :member_accounts_file => :environment do
    start_date  = ENV["START_DATE"] || Date.yesterday
    end_date    = ENV["END_DATE"] || Date.tomorrow

    cmd = ::Exports::SaveMemberAccountsCsv.new(
            start_date: start_date,
            end_date: end_date
          )

    if cmd.member_accounts.any?
      cmd.execute!

      file_repository = cmd.file_repository
      actual_url      = file_repository.actual_url

      api_url = "#{ENV['INSURANCE_KOINS_URL']}/api/v1/insurance_accounts/process_member_accounts_file"

      response = HTTParty.get(api_url, { query: { actual_url: actual_url } })

      if response.code.to_s == "200"
        puts "Successfully called INSURANCE API"
      else
        puts "ERROR in calling INSURANCE API"
        puts "api_url: #{api_url}"
        puts "actual_url: #{actual_url}"
      end
    end
  end

  task :account_transactions_file => :environment do
    start_date  = ENV["START_DATE"] || Date.yesterday
    end_date    = ENV["END_DATE"] || Date.tomorrow
    
    if ENV["BRANCH_ID"].present?
      branches = Branch.where(id: ENV["BRANCH_ID"])
    else
      branches    = Branch.all
    end

    branches.each do |branch|
      cmd = ::Exports::SaveAccountTransactionsCsv.new(
            start_date: start_date,
            end_date: end_date,
            branch: branch
          )

      # if cmd.account_transactions.any?
      cmd.execute!

      file_repository = cmd.file_repository
      actual_url      = file_repository.actual_url

      api_url = "#{ENV['INSURANCE_KOINS_URL']}/api/v1/insurance_accounts/process_account_transactions_file"

      response = HTTParty.get(api_url, { query: { actual_url: actual_url } })

      if response.code.to_s == "200"
        puts "Successfully called INSURANCE API"
      else
        puts "ERROR in calling INSURANCE API"
        puts "api_url: #{api_url}"
        puts "actual_url: #{actual_url}"
      end
      # end
    end  
  end

  task :centers_file => :environment do
    start_date  = ENV["START_DATE"] || Date.yesterday
    end_date    = ENV["END_DATE"] || Date.tomorrow
    
    if ENV["BRANCH_ID"].present?
      branches = Branch.where(id: ENV["BRANCH_ID"])
    else
      branches    = Branch.all
    end

    branches.each do |branch|
      cmd = ::Exports::SaveCentersCsv.new(
            start_date: start_date,
            end_date: end_date,
            branch: branch
          )

      cmd.execute!

      file_repository = cmd.file_repository
      actual_url      = file_repository.actual_url

      api_url = "#{ENV['INSURANCE_KOINS_URL']}/api/v1/centers/process_centers_file"

      response = HTTParty.get(api_url, { query: { actual_url: actual_url } })

      if response.code.to_s == "200"
        puts "Successfully called CENTER API"
      else
        puts "ERROR in calling CENTER API"
        puts "api_url: #{api_url}"
        puts "actual_url: #{actual_url}"
      end
    end  
  end

  task :patronage_refund => :environment do 
    require 'csv'
    accounting_reference_number = ENV["REFERENCE_NUMBER"]
    date_approved  = ENV["DATE_APPROVED"]
    CSV.open("#{Rails.root}/tmp/patronage_refund_#{accounting_reference_number}.csv", "w",:write_headers=> true, :headers => ["MEMBER" , "ID_NUMBER" ,"SAVINGS", "CBU" ] ) do |csv|
      account_transaction = AccountTransaction.where("data->>'is_patronage_refund'=? and data->>'is_interest' = ? and status = ? 
        and transaction_type = ? and data->>'accounting_entry_reference_number' = ? and transacted_at = ? " , "true","true","approved","deposit","#{accounting_reference_number}","#{date_approved.to_date}")

        account_transaction.each do |at|
          #kimpok
          subsidiary_id = at.subsidiary_id
          savings = at.amount.to_f
          member_account = MemberAccount.find(subsidiary_id)
          member = Member.find(member_account.member_id)
          account_subtype = member_account.account_subtype
          
          #cbu
          cbu = MemberAccount.where(member_id: member_account.member_id, account_type: "EQUITY", account_subtype: "CBU").first
          cbu_account_transaction = AccountTransaction.where("data->>'is_patronage_refund' = 'true'  and status = 'approved'
          and transaction_type = 'deposit' and transacted_at = '#{date_approved.to_date}' and subsidiary_id = '#{cbu.id}' ").first
          cbu_amount = cbu_account_transaction.amount.to_f
          csv << [member.full_name,member.identification_number,savings,cbu_amount]
        
        end
    end
  end




end
