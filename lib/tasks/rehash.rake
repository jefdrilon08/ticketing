namespace :rehash do
  task :fix_identification_number=> :environment do
    branch_id = ENV['branch_id']

    branch  = Branch.find(branch_id)
    branch_code = branch.short_name
    cluster_code = branch.cluster.short_name
    members = Member.where(branch_id: branch_id)
    counter = 1
    
    members.each do |mem|
      if counter == 1
        identification_number = cluster_code + branch_code + counter.to_s.rjust(5, "0")
      else
        identification_number = cluster_code + branch_code + counter.to_s.rjust(5, "0")
      end
        counter += 1
      Member.find(mem.id).update(identification_number: identification_number)
      puts "updating #{mem.id} identification_number: #{identification_number}"
    end
    puts "DONE"


  end
  task :loan_rehash_with_payment => :environment do
    first_payment = "2021-01-18".to_date
    a = AmortizationScheduleEntry.where("loan_id = ?" ,"573f02c2-b609-4ee3-ab13-41496121909c" ).order(:due_date)
    a.each do |amort|
      AmortizationScheduleEntry.find(amort.id).update(due_date: first_payment)
      if amort.data.present?
        mtrans = amort.data["payments"][0]["payment_id"]
        at = AccountTransaction.find(mtrans)
        at_data = at.data.with_indifferent_access
        at_data[:amort_entries][0][:due_date] = first_payment
        at.update(data: at_data)
      end
      first_payment = first_payment + 7.days
    end
  end


  task :loan_negative_amort => :environment do
    amort_id = ENV['ID']
  
    

    amort = AmortizationScheduleEntry.find(amort_id)
    details_sum = (amort.principal.to_f + amort.interest.to_f).to_f
  
    update_amort = amort.update(principal: details_sum, interest: 0.0, principal_paid: details_sum, interest_paid: 0.0 )

    payment_id = amort.data.with_indifferent_access[:payments][0][:payment_id]
    
    at = AccountTransaction.find(payment_id)
    at_data = at.data.with_indifferent_access
    at_data[:amort_entries][0][:principal_paid] = "#{details_sum}"
    at_data[:amort_entries][0][:interest_paid] = "0.0"
    at_data[:total_principal_paid] = "#{details_sum}"
    at_data[:total_interest_paid] = "0.0"

    at.update!(data: at_data)

    a = Loan.find(at.subsidiary_id)
    #::Loans::FixAmort.new(loan: a).execute!

    loan_amort_details =  AmortizationScheduleEntry.where("loan_id = ? and interest < ?", a,0 ).order(:due_date)
    loan_amort_details.each do |lad|
      AmortizationScheduleEntry.find(lad.id).update(principal: lad.amount_due, interest: 0.0, principal_paid: lad.amount_due, principal_balance: 0.0, interest_balance:0.0)
    end


    ::Loans::FixAmort.new(loan: a).execute!

    puts "Done."
  end


  task :member_account => :environment do
    member_account  = MemberAccount.find(ENV['ID'])
    puts "Rehashing member_account #{member_account.id}..."
    account_transactions = AccountTransaction.savings.where("amount > 0 AND subsidiary_id IN (?) AND status = ?", member_account.id, "approved")

    ::MemberAccounts::Rehash.new(
      member_account: member_account, account_transactions: account_transactions
    ).execute!

    puts "Done."
  end

  task :member_account_by_branch => :environment do
    batch_size  = ENV['BATCH_SIZE'].try(:to_i) || 10

    MemberAccount.where(
      "branch_id = ? AND account_subtype = ?",
      ENV['BRANCH_ID'],
      ENV['ACCOUNT_SUBTYPE']
    ).find_each(batch_size: batch_size) do |member_account|
      puts "Rehashing member_account #{member_account.id}..."
      account_transactions = AccountTransaction.savings.where("amount > 0 AND subsidiary_id = ? AND status = ?", member_account.id, "approved").order("transacted_at ASC")

      ::MemberAccounts::Rehash.new(
        member_account: member_account, account_transactions: account_transactions
      ).execute!
    end

    puts "Done."
  end

  task :member_accounts => :environment do
    member_accounts = MemberAccount.where.not(member_id: nil)

    if ENV["BRANCH_ID"].present?
      member_accounts = member_accounts.where(branch_id: ENV["BRANCH_ID"])
    end

    if ENV["ACCOUNT_TYPE"].present?
      member_accounts = member_accounts.where(account_type: ENV["ACCOUNT_TYPE"])
    end

    if ENV["ACCOUNT_SUBTYPE"].present?
      member_accounts = member_accounts.where(account_subtype: ENV["ACCOUNT_SUBTYPE"])
    end
  
    size  = member_accounts.length
    member_accounts.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Rehasing member account #{o.id}... #{progress}%%")
      sleep(1)

      ::MemberAccounts::Rehash.new(
        member_account: o
      ).execute!
    end

    puts ""
    puts "Done."
  end

  task :loans => :environment do
    #loans = Loan.active_or_paid
    loans = Loan.where(id: "a810c835-ee22-4326-9b9a-7a20533ee043")

    if ENV['BRANCH_ID'].present?
      branch  = Branch.find(ENV['BRANCH_ID'])
      loans   = loans.where(branch_id: branch.id)

      puts "Rehashing loans for branch #{branch.name}"
    end

    size  = loans.size


    loans.each_with_index do |loan, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Rehasing loan #{loan.id}... #{progress}%%")
      sleep(0.1)

      ::Loans::FixAmort.new(
        loan: loan
      ).execute!

#      ::Loans::Reage.new(
#        loan: loan,
#        approved_by: "SYSTEM"
#      ).execute!
    end

    puts ""
    puts "Done."
  end

  task :cbu_accounts => :environment do
    branch_id = ENV['BRANCH_ID']
    member_id = Member.where(branch_id: branch_id).ids
        member_id.each do |mem_id|
          cbu_ids   = MemberAccount.where("member_id = ? AND account_type = ? and account_subtype = ?",mem_id, "EQUITY","CBU")
            
          count = cbu_ids.count
            if count > 1 
                cbu_1 = cbu_ids[0].id
                cbu_2 = cbu_ids[1].id
                acc_t1 = AccountTransaction.where(subsidiary_id: cbu_1,status: "approved").ids
                acc_t2 = AccountTransaction.where(subsidiary_id: cbu_2,status: "approved").ids
                counter_1= acc_t1.count
                counter_2= acc_t2.count
                
                if counter_2 > counter_1
                  
                  acc_t1.each do |ac1|
                    
                    AccountTransaction.find(ac1).update(subsidiary_id: cbu_2)
                   
                  end

                    ::MemberAccounts::Rehash.new(member_account: MemberAccount.find(cbu_2), account_transactions: nil ).execute!
                    balance_2 = MemberAccount.find(cbu_2)
                    puts "DONE REHASHING 1st CBU ACCOUNT #{cbu_2} - #{balance_2.balance}"
                    
                    ::MemberAccounts::Rehash.new(member_account: MemberAccount.find(cbu_1), account_transactions: nil ).execute!
                    balance_1 = MemberAccount.find(cbu_1)
                    puts "DONE REHASHING 2nd CBU ACCOUNT #{cbu_1} - #{balance_1.balance}"

                      memb_acc= MemberAccount.find(cbu_1)

                      if memb_acc.balance == 0.0
                        MemberAccount.find(memb_acc.id).delete
                      puts "Delete 2nd cbu account" 
                      end
                 

                elsif counter_2 < counter_1

                  acc_t2.each do |ac2|
                    
                    AccountTransaction.find(ac2).update(subsidiary_id: cbu_1)
                    
                  end

                    ::MemberAccounts::Rehash.new(member_account: MemberAccount.find(cbu_1), account_transactions: nil ).execute!
                    balance_1 = MemberAccount.find(cbu_1)
                    puts "DONE REHASHING 2nd CBU ACCOUNT #{cbu_1} - #{balance_1.balance}"
                    
                    ::MemberAccounts::Rehash.new(member_account: MemberAccount.find(cbu_2), account_transactions: nil ).execute!
                    balance_2 = MemberAccount.find(cbu_2)
                    puts "DONE REHASHING 1st CBU ACCOUNT #{cbu_2} - #{balance_2.balance}"

                      memb_acc= MemberAccount.find(cbu_2)
                      if memb_acc.balance == 0.0
                        MemberAccount.find(memb_acc.id).delete
                      puts "Delete 2nd cbu account" 
                      end

                elsif  counter_1 == 1 and counter_2 == 1
                    acc_t2.each do |ac2|
                    
                    AccountTransaction.find(ac2).update(subsidiary_id: cbu_1)
                   
                    end

                     ::MemberAccounts::Rehash.new(member_account: MemberAccount.find(cbu_1), account_transactions: nil ).execute!
                    balance_1 = MemberAccount.find(cbu_1)
                    puts "DONE REHASHING 2nd CBU ACCOUNT #{cbu_1} - #{balance_1.balance}"
                    
                    ::MemberAccounts::Rehash.new(member_account: MemberAccount.find(cbu_2), account_transactions: nil ).execute!
                    balance_2 = MemberAccount.find(cbu_2)
                    puts "DONE REHASHING 1st CBU ACCOUNT #{cbu_2} - #{balance_2.balance}"

                      memb_acc= MemberAccount.find(cbu_2)
                      if memb_acc.balance == 0.0
                        MemberAccount.find(memb_acc.id).delete
                      puts "Delete 2nd cbu account" 
                      end
               
                
                end

            end
               
        end
  end


  task :download_cbu_accounts_excel => :environment do
     require 'csv'
      branch_id = ENV['BRANCH_ID']
      member_id = Member.where(branch_id: branch_id).ids
      CSV.open("#{Rails.root}/tmp/cbu_account.csv", "w",:write_headers=> true, :headers => ["ID NUMBER" , "LAST_NAME" ,"FIRST_NAME", "MEMBER STATUS","CBU ID" , "BALANCE" ] ) do |csv|
        member_id.each do |mem_id|
            cbu_ids   = MemberAccount.where("member_id = ? AND account_type = ? and account_subtype = ?",mem_id, "EQUITY","CBU")
            cbu_ids.each do |cbo|
            cbuid= cbo.id
            balance= MemberAccount.find(cbo.id).balance
            id_n= Member.find(mem_id).id
            last_n= Member.find(mem_id).last_name
            first_n = Member.find(mem_id).first_name
            status = Member.find(mem_id).status
            csv << [id_n,last_n,first_n,status,cbuid,balance]
          end
        end
      end
      
      puts "DONE"
  end

  task :double_billing => :environment do
    billing_id =ENV['BILLING_ID']
    billing_data = Billing.find(billing_id)
    billing_dd= billing_data.data.with_indifferent_access[:records]
    @date_approved = billing_data.date_approved
    @data={}
    @data[:records] = {
      loan_records: [],
      savings_records: [],
      wp_records: [],
      insurance_records:[] }

      billing_dd.each do |bd|
        bd[:records].map{ |o|
            if o.fetch("amount").to_f > 0.0 and o.fetch("record_type") == "LOAN_PAYMENT"
              @data[:records][:loan_records] << {
              loan_id: o.fetch("loan_id"),
              amount: o.fetch("amount")
             }
            end
          }
        bd[:records].map{ |o|
              if o.fetch("amount").to_f > 0.0 and o.fetch("record_type") == "SAVINGS"
               @data[:records][:savings_records] << {
                savings_id: o.fetch("member_account_id"),
                amount: o.fetch("amount"),
                savings_type: o.fetch("account_subtype")
               }
              end
              }

        bd[:records].map{ |o|
                if o.fetch("amount").to_f > 0.0 and o.fetch("record_type") == "WP"
                @data[:records][:wp_records] << {
                wp_account: o.fetch("member_account_id"),
                amount: o.fetch("amount")
                }
                end
            
        }
        

        bd[:records].map{ |o|
                if o.fetch("amount").to_f > 0.0 and o.fetch("record_type") == "INSURANCE"
                @data[:records][:insurance_records] << {
                insurance_id: o.fetch("member_account_id"),
                amount: o.fetch("amount"),
                insurance_type: o.fetch("account_subtype")
                }
                end
            
        }
       end

      
       #loans
        @data[:records][:loan_records].each do |bl|
          act= AccountTransaction.where(subsidiary_id: bl[:loan_id], transaction_type: "loan_payment",transacted_at: @date_approved ).order('created_at ASC')
            if act.count > 1
              id_last= act.last.id
              AccountTransaction.find(id_last).delete
              puts "rehashing loan #{bl[:loan_id]}"
              ::Loans::FixAmort.new(loan: Loan.find(bl[:loan_id])).execute!
            end
        end
        #savings
        @data[:records][:savings_records].each do |sv|
          act_sav = AccountTransaction.where(subsidiary_id: sv[:savings_id], subsidiary_type: "MemberAccount",transacted_at: @date_approved,status: "approved", transaction_type: "deposit")
          if act_sav.count > 1
            id_first= act_sav.first.id
            AccountTransaction.find(id_first).delete
            puts "rehashing member account #{sv[:savings_id]}"
            ::MemberAccounts::Rehash.new(member_account: MemberAccount.find(sv[:savings_id]), account_transactions: nil ).execute!
          end
        end
        #insurance
        @data[:records][:insurance_records].each do |ins|
          act_ins= AccountTransaction.where(subsidiary_id: ins[:insurance_id],subsidiary_type: "MemberAccount",transacted_at: @date_approved,status: "approved")
          if act_ins.count > 1 
            id_first= act_ins.first.id
            AccountTransaction.find(id_first).delete
            puts "rehashing insurance account #{ins[:insurance_id]}"
            ::MemberAccounts::Rehash.new(member_account: MemberAccount.find(ins[:insurance_id]), account_transactions: nil ).execute!
          end
        end
        #wp_records
        @data[:records][:wp_records].each do |wp|
          act_sav = AccountTransaction.where(subsidiary_id: wp[:wp_account], subsidiary_type: "MemberAccount",transacted_at: @date_approved,status: "approved", transaction_type: "withdraw")
          if act_sav.count > 1
            id_first= act_sav.first.id
            AccountTransaction.find(id_first).delete
            puts "rehashing member account #{ wp[:wp_account] }"
            ::MemberAccounts::Rehash.new(member_account: MemberAccount.find( wp[:wp_account]), account_transactions: nil ).execute!
          end
        end


  end

end
