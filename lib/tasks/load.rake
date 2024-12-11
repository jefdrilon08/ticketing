namespace :load do

  task :load_member_project_type => :environment do
      branch = ENV['BRANCH']
      data = ::Reports::GenerateMemberProjectType.new(branch: branch).execute!
      data[:list].each do |l|
        puts "-- | #{l[:category_name]} | #{l[:category_count]}"
        l[:list].each do |type_detail|
          puts " - |#{type_detail[:type_name]} | #{type_detail[:loan_detail_count]} | -"
          type_detail[:loan_details].each_with_index do |ld, i|
            puts "#{ i + 1} | #{ ld[:member_name] } | #{ ld[:principal]}"
          end
        end
      end

  end



  task :manual_member_count_pure_savers => :environment do
    branch = ENV['BRANCH_ID']
    
    
    kaagapay = Member.where(member_type: "Kaagapay", status: "active", branch_id:branch)
    puts "ID | Member Name | Gender"

    member_id = Loan.where("loans.status = ? and loans.branch_id = ? and loans.member_id NOT IN (?) ", "active", branch, kaagapay.ids).pluck(:member_id).uniq
    
    a = Member.where('id NOT IN (?) and id NOT IN (?) and branch_id = ? and status = ?', member_id,kaagapay.ids , branch,"active")
    
    memAcc = MemberAccount.where("member_id IN (?) and account_subtype = ? and balance > 0.0", a.ids, "K-IMPOK").pluck(:member_id)
    
    memAcc.each do |mi|
      mem = Member.find(mi)
      puts "#{mem.identification_number} | #{mem.full_name} | #{mem.gender}"
    end


  end


  task :manual_member_count_active_member => :environment do
    branch = ENV['BRANCH_ID']
    
    
    kaagapay = Member.where(member_type: "Kaagapay", status: "active", branch_id:branch)
    puts "ID | Member Name | Gender"

    member_id = Loan.where("loans.status = ? and loans.branch_id = ? and loans.member_id NOT IN (?) ", "active", branch, kaagapay.ids).pluck(:member_id).uniq
    
    a = Member.where('id NOT IN (?) and id NOT IN (?) and branch_id = ? and status = ?', member_id,kaagapay.ids , branch,"active")
    
    memAcc = MemberAccount.where("member_id IN (?) and account_subtype = ? and balance = 0.0", a.ids, "K-IMPOK").pluck(:member_id)
    
    memAcc.each do |mi|
      mem = Member.find(mi)
      puts "#{mem.identification_number} | #{mem.full_name} | #{mem.gender}"
    end


  end


  task :manual_member_count_active_loaner => :environment do
    branch = ENV['BRANCH_ID']
    
    
    kaagapay = Member.where(member_type: "Kaagapay", status: "active", branch_id:branch)
    puts "ID | Member Name | Gender"

    member_id = Loan.where("loans.status = ? and loans.branch_id = ? and loans.member_id NOT IN (?) ", "active", branch, kaagapay.ids).pluck(:member_id).uniq
    member_id.each do |mi|
      mem = Member.find(mi)
      puts "#{mem.identification_number} | #{mem.full_name} | #{mem.gender}"
    end


  end



  task :manual_member_count_kaagapay => :environment do
    branch = ENV['BRANCH_ID']
  
    
    kaagapay = Member.where(member_type: "Kaagapay", status: "active", branch_id:branch)
  
    puts "KAAGAPAY"
    puts "ID | Member Name | Gender"
    kaagapay.each do |k|
      mem = Member.find(k.id)
      puts "#{mem.identification_number} | #{mem.full_name} | #{mem.gender}"
      
    end


  end


  task :cda => :environment do
    member= Member.where(center_id: "1604d890-7ebd-4c25-877a-219619c274ee", status: "active")
    member.each do |m|
      
      memberShare = MemberShare.where(member_id: m.id)
      memberShareCount = MemberShare.where(member_id: m.id, is_void: nil).count
    
      memberShare.each do |z|
        puts "#{z.date_of_issue} |#{m.full_name} |  #{m.data.with_indifferent_access[:address][:street]}, #{m.data.with_indifferent_access[:address][:city]}| #{z.certificate_number}  | #{memberShareCount} | 100  "
      end
    end
  
  end
  task :loan_member_age => :environment do
    member_id = Member.where(
                              "status = ? and 
                               extract(year from date_of_birth) >= ? and 
                               extract(year from date_of_birth) <= ? and 
                               extract(month from date_of_birth) <= ? and 
                               branch_id = ? ", 
                               "active", 
                               "1993", 
                               "2001", 
                               5, 
                               "3726405b-777c-4b61-b6a5-7a4b48db62b6"
                            )

    member_id.each do |m|
      loan_details = Loan.where(member_id: m.id, status: "active")
      d = []
      loan_details.each do |g|
        if g
          #raise  g.project_type.inspect
          if g.project_type_id
            
            x = g.project_type.name
          end
          h  = "#{g.loan_product.name} | #{x} "
          d << h
        end
      end

      membership_account = MemberAccount.where(member_id: m.id, account_subtype: "Share Capital")
      membetship_date = AccountTransaction.where(subsidiary_id: membership_account.ids).order(:transacted_at).last.transacted_at

    
    

      puts "#{m.id} | #{m.status}| #{m.full_name} | #{m.date_of_birth} | #{Center.find(m.center_id).name} | #{m.data.with_indifferent_access[:address][:street]}, #{m.data.with_indifferent_access[:address][:city]}| #{membetship_date} | #{d}"
    end
  end



  task :loan_cycles_from_file => :environment do
    puts "reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    data        = JSON.parse(File.read("#{params[:root]}/#{params[:filename]}")).deep_symbolize_keys!
    loan_cycles = data[:loan_cycles]

    size  = loan_cycles.size

    loan_cycles.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Processing loan_cycles... #{progress}%%")
      loan  = Loan.where(id: o[:id]).first

      if loan.present?
        loan.update!(cycle: o[:cycle])
      else
        puts ""
        puts "Loan #{o[:id]} not found"
      end
    end

    puts "Done."
  end

  task :member_loan_cycles_from_file => :environment do
    puts "reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    data  = JSON.parse(File.read("#{params[:root]}/#{params[:filename]}")).deep_symbolize_keys!

    member_loan_cycles  = data[:member_loan_cycles]

    size  = member_loan_cycles.size

    member_loan_cycles.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Processing member_loan_cycles... #{progress}%%")
      member    = Member.where(id: o[:member_id]).first

      if member.present?
        member_data = member.data.with_indifferent_access

        loan_cycles = member_data[:loan_cycles]

        if loan_cycles.blank?
          loan_cycles = []
        end

        update  = false
        loan_cycles.each_with_index do |lc, i|
          if lc[:loan_product_id] == o[:loan_product_id]
            loan_cycles[i][:cycle] = o[:cycle]
            update  = true
          end
        end

        if !update
          loan_cycles << o
        end

        member_data[:loan_cycles] = loan_cycles

        member.update!(data: member_data)
      else
        puts ""
        puts "Member #{o[:member_id]} not found"
      end
    end

    puts "Done."
  end

  task :member_shares_from_file => :environment do
    puts "reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertMemberSharesFromFile.new(params: params).execute!

    puts "Done."
  end

  task :beneficiaries_from_file => :environment do
    puts "reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertBeneficiariesFromFile.new(params: params).execute!

    puts "Done."
  end

  task :legal_dependents_from_file => :environment do
    puts "reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertLegalDependentsFromFile.new(params: params).execute!

    puts "Done."
  end

  task :billings_from_file => :environment do
    puts "reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertAccountTransactionCollectionsFromFile.new(params: params).execute!

    puts "Done."
  end

  task :loan_payments_from_file => :environment do
    puts "reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertLoanPaymentsFromFile.new(params: params).execute!

    puts "Done."
  end

  task :member_account_transactions_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertMemberAccountTransactionsFromFile.new(params: params).execute!

    puts "Done."
  end

  task :member_accounts_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertMemberAccountsFromFile.new(params: params).execute!

    puts "Done."
  end

  task :amortization_schedule_entries_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertAmortizationScheduleEntriesFromFile.new(params: params).execute!

    puts "Done."
  end

  task :loans_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertLoansFromFile.new(params: params).execute!

    puts "Done."
  end

  task :membership_payments_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertMembershipPaymentsFromFile.new(params: params).execute!

    puts "Done."
  end


  task :update_loan_products_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::UpdateLoanProductsFromFile.new(params: params).execute!

    puts "Done."
  end

  task :loan_products_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertLoanProductsFromFile.new(params: params).execute!

    puts "Done."
  end

  task :project_types_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertProjectTypesFromFile.new(params: params).execute!

    puts "Done."
  end

  task :project_type_categories_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertProjectTypeCategoriesFromFile.new(params: params).execute!

    puts "Done."
  end

  task :journal_entries_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertJournalEntriesFromFile.new(params: params).execute!

    puts "Done."
  end

  task :accounting_entries_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertAccountingEntriesFromFile.new(params: params).execute!

    puts "Done."
  end

  task :members_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertMembersFromFile.new(params: params).execute!

    puts "Done."
  end

  task :centers_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertCentersFromFile.new(params: params).execute!

    puts "Done."
  end

  task :branches_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertBranchesFromFile.new(params: params).execute!

    puts "Done."
  end

  task :clusters_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertClustersFromFile.new(params: params).execute!

    puts "Done."
  end

  task :areas_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertAreasFromFile.new(params: params).execute!

    puts "Done."
  end

  task :accounting_codes_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertAccountingCodesFromFile.new(params: params).execute!

    puts "Done."
  end

  task :users_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertUsersFromFile.new(params: params).execute!

    puts "Done."
  end

  task :accounting_funds_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertAccountingFundsFromFile.new(params: params).execute!

    puts "Done."
  end
  
  task :clipclaims_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertClipClaimsFromFile.new(params: params).execute!

    puts "Done."
  end

  task :blipclaims_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertBlipClaimsFromFile.new(params: params).execute!

    puts "Done."
  end

  task :validations_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertValidationsFromFile.new(params: params).execute!

    puts "Done."
  end

  task :validation_records_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertValidationRecordsFromFile.new(params: params).execute!

    puts "Done."
  end

  task :claims_from_file => :environment do
    puts "Reading file #{ENV['FILENAME']} from #{ENV['ROOT']}..."

    params  = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
    }

    ::Loaders::InsertClaimFromFile.new(params: params).execute!

    puts "Done."
  end

   task :tungko_adjustment_interest => :environment do
    puts "Reading File #{ENV['FILENAME']} from #{ENV['ROOT']}"
    params = {
      root: ENV['ROOT'],
      filename: ENV['FILENAME']
      }
      data= JSON.parse(File.read("#{params[:root]}/#{params[:filename]}"))
      data.each_with_index do |(key, value), index|
          puts "*processing index number: #{index}"
           subsidiary_id  = key["subsidiary_id"]
           amount         = key["amount"].round(2)
          puts "*Inserting to subsidiary_id: '#{subsidiary_id}' and amount: #{amount}"
          account_transaction = AccountTransaction.create!(subsidiary_id: subsidiary_id, 
          subsidiary_type: "MemberAccount", 
          amount: amount, 
          transaction_type: "deposit" , 
          transacted_at: "2019-12-31", 
          status: "approved" , 
          data: {is_withdraw_payment: false, 
                 is_fund_transfer: false, 
                 is_interest: true, 
                 is_adjusment: false, 
                 is_for_exit_age: false, 
                 accounting_entry_reference_number: nil, 
                 beginning_balance: 0.00, 
                 ending_balance: amount})
        account_transaction.save!
        puts "*Done Creating Account Transaction."
        puts "*rehashing subsidiary account #{subsidiary_id}."
        ::MemberAccounts::Rehash.new(member_account: MemberAccount.find(subsidiary_id)).execute!
        puts "*Done Rehash."
        puts "-----------------------------------------------------"
        end
    puts "DONE."
  end
end
