namespace :debug do
  task :approve_online_loan => :environment do
      loan_application_id = ENV["BRANCH_ID"]
    
        online_application  = LoanApplication.find(loan_application_id)
        online_application_data = Member.find(online_application.member_id)

        member = Member.find(online_application.member_id)
        #member = Member.find(online_application.member_id)
        co_maker = Member.find(online_application.co_maker_member_id) 
        loan_data = {
                      id: nil,
                      branch_id: member.branch_id,
                      center_id: member.center_id,
                      date_prepared: Date.today,
                      member_id: member.id,
                      principal: online_application.amount,
                      loan_product_id: online_application.loan_product_id,
                      term: online_application.term,
                      pn_number: online_application.reference_number,
                      num_installments: online_application.num_installments,
                      project_type_id: online_application.data['project_type_id'],
                      status: "pending",
                      data: {
                              voucher:{
                                        bank:"",
                                        bank_check_number: "",
                                        check_number: "",
                                        payee:"",
                                        date_requested: "",
                                        date_of_check: "",
                                        particular: ""
                                      },
                              co_maker_two: online_application.co_maker_last_name,
                              co_maker_one: {
                                value: co_maker.id,
                                label: co_maker.full_name,
                                id: co_maker.id,
                                first_name: co_maker.first_name , 
                                middle_name: co_maker.middle_name,
                                last_name: co_maker.last_name
                              },
                              clip_beneficiary: {
                                first_name: online_application.data['clip_beneficiary']['first_name'],
                                middle_name: online_application.data['clip_beneficiary']['middle_name'],
                                last_name: online_application.data['clip_beneficiary']['last_name'],
                                date_of_birth: online_application.data['clip_beneficiary']['date_of_birth'],
                                relationship: online_application.data['clip_beneficiary']['relationship']

                              }
                            }


                    }


        config  = { 
                    loan_data: loan_data, 
                    user: User.find("08531705-8e42-4e84-aac6-166d5046f91a"), 
                    co_maker_profile_picture: nil, 
                    co_maker_three_profile_picture: nil 
                  }

        data = ::Loans::Save.new(config: config).execute!
        online_application.update!(status: "approved")

  end
  task :reamortize_active_loan => :environment do
    branch_id = ENV["BRANCH_ID"]

    loan = Loan.where(branch_id: branch_id, status: "active")
    size    = loan.size
    loan.each_with_index do |l,i|
      
      ::Loans::ResetAmortizationDates.new(config: {loan: l}).execute!

      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): #{progress}%%")
      
    end

  end

  task :monitor_personal_funds => :environment do
    data_store      = DataStore.personal_funds.find(ENV["ID"])
    account_type    = ENV["ACCOUNT_TYPE"]
    account_subtype = ENV["ACCOUNT_SUBTYPE"]
    data            = data_store.data.with_indifferent_access
    as_of           = data[:as_of]
    invalid_records = []

    total_discrepancy = 0.00

    size    = data[:records].size

    data[:records].each_with_index do |record, i|
      account = record[:accounts].select{ |o|
                  o[:account_type] == account_type && o[:account_subtype] == account_subtype
                }.first

      if account[:id].present?
        deposits    = AccountTransaction.personal_funds_deposits.where("subsidiary_id = ? AND DATE(transacted_at) <= ?", account[:id], as_of).sum(:amount)
        withdrawals = AccountTransaction.personal_funds_withdrawals.where("subsidiary_id = ? AND DATE(transacted_at) <= ?", account[:id], as_of).sum(:amount)

        correct_balance = (deposits - withdrawals).round(2)

        if account[:balance].to_f.round(2) != correct_balance
          puts ""
          puts "Found inconsistent account #{account[:id]} Reported balance: #{account[:balance]} | Correct balance: #{correct_balance}"
          invalid_records << {
            id: account[:id],
            reported_balance: account[:balance],
            correct_balance: correct_balance
          }

          if account[:balance] > correct_balance
            total_discrepancy += (account[:balance] - correct_balance)
          else
            total_discrepancy += (correct_balance - account[:balance])
          end
        end
      end

      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): #{progress}%%")
    end

    if invalid_records.any?
      puts "Found #{invalid_records.size} invalid records out of #{size}"

      invalid_records.each do |o|
        puts "Account ID: #{o[:id]}"
        puts "Reported Balance: #{o[:reported_balance]}"
        puts "Correct Balance: #{o[:correct_balance]}"
        puts "=================================================="
      end

      puts "Total discrepancy: #{total_discrepancy}"
    else
      puts "No invalid records found."
    end
  end

  task :repair_cbu_account => :environment do 
    ma = MemberAccount.where(account_type: "SAVINGS", account_subtype: "CBU")
    size = ma.size
    ma.each_with_index do |m,i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Member Account #{m.id}... #{progress}%%")
      MemberAccount.find(m.id).update!(account_type: "EQUITY")
      
    end
  
  end

  task :delete_loan_payment => :environment do
    loans = Loan.where(branch_id: "3cccd843-3fa8-4693-b60c-dea2505c6b57")
    size = loans.size

    loans.each_with_index do |l,i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Examining #{l.id}... #{progress}%%")
      at = AccountTransaction.where(subsidiary_id: l.id, subsidiary_type: "Loan")
      at.each do |a|
        AccountTransaction.find(a.id).destroy!
      end
    end
  end

  task :load_date_completed => :environment do
    branch_id = ENV['BRANCH_ID']
    loans = Loan.where("branch_id = ? and status = ? and date_completed IS NULL ", branch_id, "paid" )
    size = loans.size

    loans.each_with_index do |l,i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): date completed #{l.id}... #{progress}%%")
      account_transaction = AccountTransaction.where(subsidiary_id: l.id).order(:transacted_at).last
      Loan.find(l.id).update(date_completed: account_transaction.transacted_at)
      
    end
    puts "Done"
  end
  task :loan_reamortize => :environment do
    loan                    = Loan.find(ENV['ID'])
    p_principal             = ENV['P_PRINCIPAL'].to_f.round(2)
    p_monthly_interest_rate = ENV['P_MONTHLY_INTEREST_RATE'].to_f
    p_num_installments      = ENV['P_NUM_INSTALLMENTS']
    #p_term                  = loan.term
    p_term                  = ENV['P_TERM']

    config  = {
      loan: loan,
      p_principal: p_principal,
      p_monthly_interest_rate: p_monthly_interest_rate,
      p_num_installments: p_num_installments,
      p_term: p_term
    }

    data  = ::Loans::Reamortize.new(
              config: config
            ).execute!

    puts "Loan:"
    puts "========================"
    puts "ID: #{data[:loan][:id]}"
    puts "Loan Product: #{data[:loan_product][:name]}"
    puts "PN Number: #{data[:loan][:pn_number]}"
    puts "Monthly Interest Rate: #{data[:loan][:monthly_interest_rate]}"
    puts "Num Installments: #{data[:loan][:num_installments]}"
    puts "Term: #{data[:loan][:term]}"
    puts "Principal: #{data[:loan][:principal]}"
    puts "Interest: #{data[:loan][:interest]}"
    puts "Principal Paid: #{data[:loan][:principal_paid]}"
    puts "Interest Paid: #{data[:loan][:interest_paid]}"
    puts "Principal Balance: #{data[:loan][:principal_balance]}"
    puts "Interest Balance: #{data[:loan][:interest_balance]}"
    puts ""

    puts "Original Amortization:"
    puts "========================"

    values  = []
    total_principal         = 0.00
    total_interest          = 0.00
    total_principal_paid    = 0.00
    total_interest_paid     = 0.00
    total_principal_balance = 0.00
    total_interest_balance  = 0.00

    data[:original_amortization_schedule_entries].each do |a|
      total_principal         += a.principal
      total_interest          += a.interest
      total_principal_paid    += a.principal_paid
      total_interest_paid     += a.interest_paid
      total_principal_balance += a.principal_balance
      total_interest_balance  += a.interest_balance

      values << [
        a.due_date.strftime("%B %d, %Y"),
        a.principal, 
        a.interest,
        a.principal_paid,
        a.interest_paid,
        a.principal_balance,
        a.interest_balance,
        a.is_paid ? 'Yes' : 'No'
      ]
    end

    values << [
      'TOTAL',
      total_principal,
      total_interest,
      total_principal_paid,
      total_interest_paid,
      total_principal_balance,
      total_interest_balance,
      ''
    ]

    original_amortization_table = TTY::Table.new(
                                    [
                                      'Due Date',
                                      'Principal',
                                      'Interest',
                                      'Principal Paid',
                                      'Interest Paid',
                                      'Principal Balance',
                                      'Interest Balance',
                                      'Is Paid'
                                    ],
                                    values
                                  )


    puts original_amortization_table.render :ascii

    puts ""

    puts "Reamortized"
    puts "========================"

    values  = []
    total_principal         = 0.00
    total_interest          = 0.00
    total_principal_paid    = 0.00
    total_interest_paid     = 0.00
    total_principal_balance = 0.00
    total_interest_balance  = 0.00

    data[:reamortized].each_with_index do |a, i|
      total_principal         += a[:principal]
      total_interest          += a[:interest]
      total_principal_paid    += a[:principal_paid]
      total_interest_paid     += a[:interest_paid]
      total_principal_balance += a[:principal_balance]
      total_interest_balance  += a[:interest_balance]

      values << [
        "Payment #{i + 1}",
        a[:principal], 
        a[:interest],
        a[:principal_paid],
        a[:interest_paid],
        a[:principal_balance],
        a[:interest_balance],
        a[:is_paid] ? 'Yes' : 'No'
      ]
    end

    values << [
      'TOTAL',
      total_principal,
      total_interest,
      total_principal_paid,
      total_interest_paid,
      total_principal_balance,
      total_interest_balance,
      ''
    ]

    reamortized_amortization_table  = TTY::Table.new(
                                        [
                                          'Due Date',
                                          'Principal',
                                          'Interest',
                                          'Principal Paid',
                                          'Interest Paid',
                                          'Principal Balance',
                                          'Interest Balance',
                                          'Is Paid'
                                        ],
                                        values
                                      )


    puts reamortized_amortization_table.render :ascii

    puts ""

    puts "Summary"
    puts "========================"
    puts "Principal: #{data[:loan][:principal]}"
    puts "Interest: #{data[:loan][:interest]}"
    puts "Remaining Principal Balance: #{data[:remaining_principal_balance]}"
    puts "Remaining Interest Balance: #{data[:remaining_interest_balance]}"
    puts "Remaining Total Balance: #{data[:remaining_balance]}"
    puts "Excess Principal Paid: #{data[:excess_principal_paid]}"
    puts "Excess Interest Paid: #{data[:excess_interest_paid]}"
    puts "Should Be Principal: #{data[:should_be_principal]}"
    puts "Should Be Interest: #{data[:should_be_interest]}"
    puts "Should Be Dues: #{data[:should_be_dues]}"

  end

  task :loan_repayment_rate => :environment do
    as_of = ENV['AS_OF'].to_date
    loan  = Loan.find(ENV['LOAN_ID'])

    data  = ::Reports::GenerateLoanRepaymentReport.new(
              config: {
                as_of: as_of,
                loan: loan
              }
            ).execute!

    puts "REPAYMENT RATE FOR LOAN #{loan.id}"
    puts "Member: #{loan.member.full_name}"
    puts "Branch: #{loan.branch.to_s}"
    puts "As of: #{as_of}"
    puts "===================================="
    puts "principal: #{data[:principal]}"
    puts "interest: #{data[:interest]}"
    puts "total: #{data[:total]}"
    puts "principal_due: #{data[:principal_due]}"
    puts "interest_due: #{data[:interest_due]}"
    puts "principal_paid: #{data[:principal_paid]}"
    puts "interest_paid: #{data[:interest_paid]}"
    puts "total_paid: #{data[:total_paid]}"
    puts "principal_paid_due: #{data[:principal_paid_due]}"
    puts "interest_paid_due: #{data[:interest_paid_due]}"
    puts "total_paid_due: #{data[:total_paid_due]}"
    puts "principal_balance: #{data[:principal_balance]}"
    puts "interest_balance: #{data[:interest_balance]}"
    puts "total_balance: #{data[:total_balance]}"
    puts "overall_principal_balance: #{data[:overall_principal_balance]}"
    puts "overall_interest_balance: #{data[:overall_interest_balance]}"
    puts "overall_balance: #{data[:overall_balance]}"
    puts "principal_rr: #{data[:principal_rr]}"
    puts "interest_rr: #{data[:interest_rr]}"
    puts "total_rr: #{data[:total_rr]}"
    puts "par: #{data[:par]}"
    puts "num_days_par: #{data[:num_days_par]}"
  end
end
