namespace :adjust do
  task :input_member_name_in_loan_data => :environment do
    br_name = ENV['SATO']
    br_id   = Branch.where(name: br_name).ids
    Loan.where("branch_id = ?", br_id).find_in_batches(batch_size: 100) do |group|
      group.each do |o|
        member_name = Member.find(o.member_id).full_name
        data = o.data.with_indifferent_access
        data["member_full_name"] = member_name
        o.update(data: data)
        puts "input #{member_name}"

      end
    end
  end
  task :load_additional_fields_in_journal_entries => :environment do
    JournalEntry.select("*").find_in_batches(batch_size: 100) do |group|
      group.each do |o|
        puts "Updating journal entry #{o.id}"

        o.update!(updated_at: Time.now)
      end
    end
  end

  task :load_additional_fields_in_membership_payment_collections => :environment do
    MembershipPaymentCollection.select("id,or_number,ar_number,total_collected,data,status,center_id,branch_id,updated_at").find_in_batches(batch_size: 100) do |group|
      group.each do |o|
        puts "Updating membership payment collection #{o.id}"
        o.update!(updated_at: Time.now)
      end
    end
  end

  task :load_additional_fields_in_billings => :environment do
    Billing.select("id,date_approved,data,updated_at,or_number,ar_number,total_collected,total_expected_collections,updated_at,status,center_id,branch_id,collection_date").find_in_batches(batch_size: 100) do |group|
      group.each do |o|
        puts "Updating billing #{o.id}"

        o.update!(updated_at: Time.now)
      end
    end
  end

  task :load_dates_in_data_stores => :environment do
    DataStore.select("id, meta, as_of, start_date, end_date, status").find_in_batches(batch_size: 100) do |group|
      group.each do |data_store|
        puts "Updating data_store #{data_store.id}"

        data_store.update!(updated_at: Time.now)
      end
    end
  end

  task :offset_hours => :environment do
    start_date  = ENV['START_DATE']
    end_date    = ENV['END_DATE']
    hour        = ENV['HOUR'].to_i
    minute      = ENV['MINUTE'].to_i
    status      = ENV['STATUS'] || "approved"
    batch_size  = ENV['BATCH_SIZE'].try(:to_i) || 100
    offset      = ENV['OFFSET'].try(:to_i) || 8

    AccountTransaction.where(
      "extract(hour FROM transacted_at)::int = ? AND extract(minute FROM transacted_at) = ? AND transacted_at >= ? AND transacted_at <= ? AND amount > 0 AND status = ?",
      hour,
      minute,
      start_date,
      end_date,
      status
    ).find_each(batch_size: batch_size) do |a|
      puts "Adjusting #{a.id}"
      a.transacted_at = (a.transacted_at + offset.hours)
      a.save(touch: false)
    end

    puts "Done."
  end

  task :load_rr_totals => :environment do
    start_date  = ENV['START_DATE'].to_date
    end_date    = ENV['END_DATE'].to_date

    data_stores = DataStore.repayment_rates.where(
                    "status = ? AND DATE(data->>'as_of') >= ? AND DATE(data->>'as_of') <= ?",
                    "done",
                    start_date,
                    end_date
                  )

    size    = data_stores.size

    puts "Found #{size} records"

    data_stores.find_each(batch_size: 1).with_index do |o, i|
      data  = o.data.with_indifferent_access
      data[:total_principal]                 = 0.00
      data[:total_principal_paid]            = 0.00
      data[:total_overall_principal_balance] = 0.00
      data[:total_interest]                  = 0.00
      data[:total_interest_paid]             = 0.00
      data[:total_overall_interest_balance]  = 0.00
      data[:total_total_paid]                = 0.00
      data[:total_principal_due]             = 0.00
      data[:total_total_due]                 = 0.00
      data[:total_principal_balance]         = 0.00
      data[:total_total_balance]             = 0.00
      data[:total_overall_balance]           = 0.00
      data[:total_rr]                        = 0
      data[:total_principal_rr]              = 0
      data[:total_principal_paid_due]        = 0.00
      data[:total_interest_paid_due]         = 0.00
      data[:total_paid_due]                  = 0.00

      # Compute totals
      data[:records].each do |r|
        data[:total_principal] += r[:principal].to_f
        data[:total_principal_paid] += r[:principal_paid].to_f
        data[:total_principal_paid_due] += r[:principal_paid_due].to_f
        data[:total_overall_principal_balance] += r[:overall_principal_balance].to_f
        data[:total_interest] += r[:interest].to_f
        data[:total_interest_paid] += r[:interest_paid].to_f
        data[:total_overall_interest_balance] += r[:overall_interest_balance].to_f
        data[:total_total_paid] += r[:total_paid].to_f
        data[:total_principal_due] += r[:principal_due].to_f
        data[:total_total_due] += r[:total_due].to_f
        data[:total_total_balance] += r[:total_balance].to_f
        data[:total_principal_balance] += r[:principal_balance].to_f
        data[:total_paid_due] += r[:total_paid_due].to_f
      end

      data[:total_overall_balance] = data[:total_overall_principal_balance] + data[:total_overall_interest_balance]
      data[:total_rr] = data[:total_paid_due] / data[:total_total_due]

      data[:total_principal_rr] = data[:total_principal_paid_due] / data[:total_principal_due]

      if data[:total_principal_rr] > 1
        data[:total_principal_rr] = 1
      end

      o.update!(data: data)

      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): #{progress}%%")
    end

    puts "\nDone."
  end

  task :convert_savings_accounts_to_equity => :environment do
    account_subtype = ENV['ACCOUNT_SUBTYPE']

    if ENV['BRANCH_ID'].present?
      branch          = Branch.find(ENV['BRANCH_ID'])
    end

    member_accounts = MemberAccount.where(account_type: "SAVINGS", account_subtype: account_subtype)

    if branch.present?
      member_accounts = member_accounts.where(branch_id: branch.id)
    end

    sets  = member_accounts.map{ |r|
              "('#{r.id}')"
            }.join(",")

    if sets.present?
      query = "
        UPDATE member_accounts AS a SET
          account_type = 'EQUITY'
        FROM (values
          #{sets}
        ) AS c(id)
        WHERE c.id = a.id::text
      "

      ActiveRecord::Base.connection.execute(query)
    end

    puts "Done."
  end

  task :insert_hiip_from_withdrawal => :environment do
    puts "Fetching withdrawal collection..."

    withdrawal_collections = ::Insurance::FetchWithdrawalCollectionForHiip.new().execute!

    if ENV['BRANCH_ID'].present?
      withdrawal_collections = withdrawal_collections.where(branch_id: ENV['BRANCH_ID'])
    end

    if ENV['WITHDRAWAL_ID'].present?
      withdrawal_collections = withdrawal_collections.where(id: ENV['WITHDRAWAL_ID'])
    end

    values = []

    withdrawal_collections.each do |wc|
      wc.data.with_indifferent_access[:records].each do |rec|
        puts "#{rec[:member][:id]}"
        member = Member.find(rec[:member][:id])
        puts "#{member.full_name}"
        hiip_account = MemberAccount.where(account_subtype: "Hospital Income Insurance Plan", member_id: member.id, status: "active").first
        puts "#{hiip_account.id}"

        insurance_account_id      = hiip_account.id
        transaction_type          = 'deposit'
        transacted_at             = wc[:date_approved]
        created_at                = wc[:date_approved]
        updated_at                = wc[:date_approved]
        amount                    = rec[:total_collected].to_f.round(2)
        status                    = 'approved'

        subsidiary_id     = insurance_account_id
        subsidiary_type   = 'MemberAccount'

        trans_data  = {
        is_withdraw_payment: false,
        is_fund_transfer: false,
        is_interest: false,
        is_adjustment: false,
        is_for_exit_age: false,
        is_for_loan_payments: false,
        is_time_deposit: false,
        accounting_entry_reference_number: wc.accounting_entry[:reference_number],
        beginning_balance: 0.00,
        ending_balance: 0.00,
        lock_in_period: nil,
        data: {
                date_prepared: wc[:date_approved],
                date_approved: wc[:date_approved]
          }
        }

        values << "('#{subsidiary_id}', '#{subsidiary_type}', #{amount}, '#{transaction_type}', '#{transacted_at}', '#{status}', '#{created_at}', '#{updated_at}', '#{trans_data.to_json}')"
      end
    end

    if values.any?
      query = "INSERT INTO account_transactions (subsidiary_id, subsidiary_type, amount, transaction_type, transacted_at, status, created_at, updated_at, data) VALUES #{values.join(',')}"

      ActiveRecord::Base.connection.execute(query)
    end

    puts "Done!"
  end

  task :insert_insurance_from_loans => :environment do
    account_subtype     = ENV['ACCOUNT_SUBTYPE']
    accounting_code_id  = ENV['ACCOUNTING_CODE_ID']
    branch              = Branch.find(ENV['BRANCH_ID'])

    puts "Fetching journal entry amounts..."
    cmd = ::Loans::FetchJournalEntries.new(
            config: {
              branch: branch,
              accounting_code_id: accounting_code_id,
              account_subtype: account_subtype
            }
          )

    data  = cmd.execute!

    values  = []

    puts "Inserting records..."
    data[:records].select{ |o| o[:account_transaction_id].blank? }.each do |r|
      insurance_account_id      = r[:member_account_id]
      transaction_type          = 'deposit'
      transacted_at             = r[:date_approved]
      created_at                = r[:date_approved]
      updated_at                = r[:date_approved]
      amount                    = r[:amount].to_f.round(2)
      status                    = 'approved'

      subsidiary_id     = insurance_account_id
      subsidiary_type   = 'MemberAccount'

      trans_data  = {
        is_withdraw_payment: false,
        is_fund_transfer: false,
        is_interest: false,
        is_adjustment: false,
        is_for_exit_age: false,
        is_for_loan_payments: false,
        is_time_deposit: false,
        accounting_entry_reference_number: r[:reference_number],
        beginning_balance: 0.00,
        ending_balance: 0.00,
        lock_in_period: nil,
        data: r
      }

      values << "('#{subsidiary_id}', '#{subsidiary_type}', #{amount}, '#{transaction_type}', '#{transacted_at}', '#{status}', '#{created_at}', '#{updated_at}', '#{trans_data.to_json}')"
    end

    if values.any?
      query = "INSERT INTO account_transactions (subsidiary_id, subsidiary_type, amount, transaction_type, transacted_at, status, created_at, updated_at, data) VALUES #{values.join(',')}"

      ActiveRecord::Base.connection.execute(query)
    end

    # puts "Rehashing branch..."
    # ::MemberAccounts::BulkRehash.new(
    #   config: {
    #     branch: branch
    #   },
    #   account_subtype: account_subtype
    # ).execute!

    puts "Done."
  end

  task :load_withrawal_hiip_from_v1 => :environment do
    file_location = ENV["FILE_LOCATION"]
    puts "Searching file #{file_location}"

    member_account_ids = []
    CSV.foreach(file_location, headers: true) do |row|
      member = Member.find(row['member_uuid'])
      hiip_account = MemberAccount.where(account_subtype: "Hospital Income Insurance Plan", member_id: member.id, status: "active").first

      puts "Creating new insurance account transaction record #{hiip_account}..."

      account_transaction = AccountTransaction.new

      account_transaction.subsidiary_type = 'MemberAccount'
      account_transaction.subsidiary_id = hiip_account.id
      account_transaction.status = 'approved'
      account_transaction.amount = row['amount']
      account_transaction.transaction_type = 'deposit'
      account_transaction.transacted_at = row['date_approved']
      account_transaction.created_at = row['date_approved']
      account_transaction.updated_at = row['date_approved']

      # data
      account_transaction.data = {
                                              is_withdraw_payment: false,
                                              is_fund_transfer: false,
                                              is_interest: false,
                                              is_adjustment: false,
                                              is_for_exit_age: false,
                                              is_for_loan_payments: false,
                                              accounting_entry_reference_number: row['voucher_reference_number'],
                                              accounting_entry_particular: row['particular'],
                                              beginning_balance: 0.00,
                                              ending_balance: 0.00,
                                              data: {
                                                payment_collection_uuid: row['payment_collection_uuid'],
                                                or_number: row['or_number'],
                                                payment_collection_record_uuid: row['payment_collection_record_uuid'],
                                                first_date_of_payment: row['first_date_of_payment_data'],
                                                accounting_entry_uuid: row['accounting_entry_uuid'],
                                                approved_by: row['approved_by'],
                                                prepared_by: row['prepared_by'],
                                                book: row['book'],
                                                date_approved: row['date_approved'],
                                                date_prepared: row['date_prepared'],
                                                master_reference_number: row['master_reference_number']
                                                }
                                              }


      account_transaction.save!

      member_account_ids << account_transaction.subsidiary_id

      puts "Done creating!"
    end

    member_account_ids = member_account_ids.uniq

    account_transactions = AccountTransaction.savings.where("amount > 0 AND subsidiary_id IN (?) AND status = ?", member_account_ids, "approved")

    MemberAccount.where(id: member_account_ids, account_type: "INSURANCE").each do |acc|
      puts "Rehashing member_account #{acc.id}..."

      ::MemberAccounts::Rehash.new(member_account: acc, account_transactions: account_transactions).execute!
    end

    puts "Done!"
  end

  task :update_loans_first_date_of_payment => :environment do
    query = "
      SELECT DISTINCT ON (loans.id)
        loans.id,
        amortization_schedule_entries.due_date
      FROM
        loans
      INNER JOIN
        amortization_schedule_entries
        ON amortization_schedule_entries.loan_id = loans.id
      WHERE
        loans.status IN ('active', 'paid') AND loans.first_date_of_payment IS NULL #{ENV['BRANCH_ID'].present? ? "AND loans.branch_id = #{ENV['BRANCH_ID']}" : ''}
      GROUP BY
        loans.id, amortization_schedule_entries.due_date
      ORDER BY
        loans.id, amortization_schedule_entries.due_date ASC
    "

    result  = ActiveRecord::Base.connection.execute(query).to_a

    sets  = result.map{ |r|
              "('#{r.fetch("id")}', '#{r.fetch("due_date")}')"
            }.join(",")

    if sets.present?
      query = "
        UPDATE loans AS l SET
          first_date_of_payment  = DATE(c.first_date_of_payment)
        FROM (values
          #{sets}
        ) AS c(loan_id, first_date_of_payment)
        WHERE c.loan_id = l.id::text
      "

      ActiveRecord::Base.connection.execute(query)
    end

    puts "Done."
  end

  task :update_loans_original_maturity_date => :environment do
    loans = Loan.active_or_paid

    if ENV['BRANCH_ID'].present?
      loans = loans.where(branch_id: ENV['BRANCH_ID'])
    end

    sets  = loans.map{ |o|
              cmd = ::Loans::UpdateOriginalMaturityDate.new(
                      loan: o,
                      save: false
                    )
              cmd.execute!

              original_maturity_date  = cmd.original_maturity_date

              "('#{o.id}', '#{original_maturity_date}')"
            }.join(",")

    if sets.present?
      query = "
        UPDATE loans AS l SET
          original_maturity_date  = DATE(c.original_maturity_date)
        FROM (values
          #{sets}
        ) AS c(loan_id, original_maturity_date)
        WHERE c.loan_id = l.id::text
      "

      ActiveRecord::Base.connection.execute(query)
    end

    puts "Done."
  end

  task :fill_date_released => :environment do
    loans = Loan.where(status: ['active', 'paid'], date_released: nil)

    sets  = loans.map{ |o|
              "('#{o.id}','#{o.date_approved}')"
            }.join(",")

    if sets.present?
      query = "
        UPDATE loans AS l SET
          date_released = DATE(c.date_approved)
        FROM (values
          #{sets}
        ) AS c(loan_id, date_approved)
        WHERE c.loan_id = l.id::text
      "

      ActiveRecord::Base.connection.execute(query)
    end

    puts "Done."
  end

  task :fill_date_completed_for_paid_loans => :environment do
    branch  = Branch.find(ENV['BRANCH_ID'])

    query = "
      SELECT DISTINCT ON (loans.id)
        loans.id,
        loans.pn_number,
        loans.status,
        loans.date_completed,
        account_transactions.transacted_at
      FROM
        loans
      INNER JOIN
        account_transactions
        ON account_transactions.subsidiary_id = loans.id AND status = 'approved'
      WHERE
        loans.branch_id = '#{branch.id}' AND loans.status = 'paid'
      GROUP BY
        loans.id
      ORDER BY
        account_transactions.transacted_at DESC
    "

    result  = ActiveRecord::Base.connection.execute(query).to_a
  end

  task :fill_recognition_date_from_membership_payment => :environment do
    membership_name = ENV['MEMBERSHIP_NAME'] || 'K-MBA'
    membership_type = ENV['MEMBERSHIP_TYPE'] || 'Insurance'

    query = "
      SELECT DISTINCT ON (members.id)
        members.id,
        members.first_name,
        members.middle_name,
        members.last_name,
        members.status,
        members.insurance_status,
        members.data,
        membership_payment_records.date_paid
      FROM
        members
      INNER JOIN
        membership_payment_records
        ON membership_payment_records.member_id = members.id
        AND membership_payment_records.membership_name = '#{membership_name}'
        AND membership_payment_records.membership_type = '#{membership_type}'
      WHERE
        members.status IN ('active', 'resigned', 'resign')
      ORDER BY
        members.id, membership_payment_records.date_paid DESC
    "

    result  = ActiveRecord::Base.connection.execute(query).to_a
    size    = result.size

    puts "Found #{size} records"

    result.each_with_index do |r, i|
      m                       = Member.find(r.fetch("id"))
      data                    = m.data.with_indifferent_access
      data[:recognition_date] = r.fetch("date_paid")

      m.update!(data: data)

      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): #{progress}%%")
    end

    puts "\nDone."
  end

  task :asign_user_to_loans => :environment do
    branch  = Branch.find(ENV['BRANCH_ID'])

    ::Loans::AssignUser.new(
      config: {
        branch: branch
      }
    ).execute!

    puts "Done for #{branch.id}"
  end

  task :bulk_rehash => :environment do
    branch  = Branch.find(ENV['BRANCH_ID'])
    account_subtype  = ENV['ACCOUNT_SUBTYPE']

    ::MemberAccounts::BulkRehash.new(
      config: {
        branch: branch,
        account_subtype: account_subtype
      }
    ).execute!

    puts "Done for #{branch.id}"
  end

  task :set_max_active_date_branch => :environment do
    branch  = Branch.find(ENV['BRANCH_ID'])
    current_date_details = ENV['CURRENT_DATE']

    puts "Starting set_max_active_date..."
    current_date  = current_date_details.to_date
    #current_date  = ::Utils::GetCurrentDate.new(config: { branch: branch }).execute!

    # Do this in batches
    Loan.where(status: ['active']).find_in_batches(batch_size: 2500) do |group|

     ids = group.pluck(:id).map{ |o| "'#{o}'" }.join(",")

      data  = ActiveRecord::Base.connection.execute(<<-EOS).to_a
                SELECT DISTINCT ON (loans.id)
                  loans.id AS loan_id,
                  loans.first_date_of_payment,
                  loans.status AS status,
                  DATE(account_transactions.transacted_at) as last_transaction_date,
                  DATE(amortization_schedule_entries.due_date) as last_amortization_date
                FROM
                  loans
                  LEFT OUTER JOIN
                    account_transactions ON account_transactions.subsidiary_id = loans.id
                  INNER JOIN
                    amortization_schedule_entries ON amortization_schedule_entries.loan_id = loans.id
                  WHERE
                    loans.status IN ('active') AND loans.id IN (#{ids})
                  ORDER BY
                    loans.id,
                    amortization_schedule_entries.due_date DESC,
                    account_transactions.transacted_at DESC
              EOS




      sets  = data.map{ |d|
                loan_id                 = d.fetch("loan_id")
                last_transaction_date   = d.try(:fetch, "last_transaction_date").try(:to_date)
                last_amortization_date  = d.try(:fetch, "last_amortization_date").try(:to_date)
                status                  = d.fetch("status")

                max_active_date = current_date

                if last_amortization_date.present?
                  max_active_date = last_amortization_date
                end

                if last_transaction_date.present?
                  if current_date > last_amortization_date and ['active', 'processing'].include?(status)
                    max_active_date = current_date
                  elsif last_transaction_date > last_amortization_date
                    max_active_date = last_transaction_date
                  elsif status == 'paid' and last_transaction_date < last_amortization_date
                    max_active_date = last_transaction_date
                  end
                else
                  max_active_date = current_date
                end

                "('#{loan_id}', '#{max_active_date.to_date.to_s}')"
              }.join(",")

      query = "
        UPDATE loans AS l SET
          max_active_date = DATE(c.max_active_date)
        FROM (values
          #{sets}
        ) AS c(loan_id, max_active_date)
        WHERE c.loan_id = l.id::text
      "

      ActiveRecord::Base.connection.execute(query)
    end


    puts "Done."
  end

  task :set_max_active_date => :environment do
    #branch  = Branch.find(ENV['BRANCH_ID'])

    puts "Starting set_max_active_date..."
    current_date  = Date.today
    #current_date  = ::Utils::GetCurrentDate.new(config: { branch: branch }).execute!

    # Do this in batches
    Loan.where(status: ['active']).find_in_batches(batch_size: 2500) do |group|

     ids = group.pluck(:id).map{ |o| "'#{o}'" }.join(",")

      data  = ActiveRecord::Base.connection.execute(<<-EOS).to_a
                SELECT DISTINCT ON (loans.id)
                  loans.id AS loan_id,
                  loans.first_date_of_payment,
                  loans.status AS status,
                  DATE(account_transactions.transacted_at) as last_transaction_date,
                  DATE(amortization_schedule_entries.due_date) as last_amortization_date
                FROM
                  loans
                  LEFT OUTER JOIN
                    account_transactions ON account_transactions.subsidiary_id = loans.id
                  INNER JOIN
                    amortization_schedule_entries ON amortization_schedule_entries.loan_id = loans.id
                  WHERE
                    loans.status IN ('active') AND loans.id IN (#{ids})
                  ORDER BY
                    loans.id,
                    amortization_schedule_entries.due_date DESC,
                    account_transactions.transacted_at DESC
              EOS




      sets  = data.map{ |d|
                loan_id                 = d.fetch("loan_id")
                last_transaction_date   = d.try(:fetch, "last_transaction_date").try(:to_date)
                last_amortization_date  = d.try(:fetch, "last_amortization_date").try(:to_date)
                status                  = d.fetch("status")

                max_active_date = current_date

                if last_amortization_date.present?
                  max_active_date = last_amortization_date
                end

                if last_transaction_date.present?
                  if current_date > last_amortization_date and ['active', 'processing'].include?(status)
                    max_active_date = current_date
                  elsif last_transaction_date > last_amortization_date
                    max_active_date = last_transaction_date
                  elsif status == 'paid' and last_transaction_date < last_amortization_date
                    max_active_date = last_transaction_date
                  end
                else
                  max_active_date = current_date
                end

                "('#{loan_id}', '#{max_active_date.to_date.to_s}')"
              }.join(",")

      query = "
        UPDATE loans AS l SET
          max_active_date = DATE(c.max_active_date)
        FROM (values
          #{sets}
        ) AS c(loan_id, max_active_date)
        WHERE c.loan_id = l.id::text
      "

      ActiveRecord::Base.connection.execute(query)
    end


    puts "Done."
  end

  task :repair_personal_funds => :environment do
    data_store      = DataStore.personal_funds.find(ENV["ID"])
    account_type    = ENV["ACCOUNT_TYPE"]
    account_subtype = ENV["ACCOUNT_SUBTYPE"]
    data            = data_store.data.with_indifferent_access
    as_of           = data[:as_of]
    invalid_records = 0

    size    = data[:records].size

    data[:records].each_with_index do |record, i|
      account = record[:accounts].select{ |o|
                  o[:account_type] == account_type && o[:account_subtype] == account_subtype
                }.first

      if account[:id].present?
        member_account  = MemberAccount.find(account[:id])
        result          = MemberAccounts::CheckBalance.new(config: { member_account: member_account }).execute!

        account_transactions = AccountTransaction.savings.where("amount > 0 AND subsidiary_id IN (?) AND status = ?", member_account.id, "approved")

        if result[:running_balance] != result[:ending_balance]
          puts ""
          puts "Repairing #{member_account.id}..."
          ::MemberAccounts::Rehash.new(member_account: member_account, account_transactions: account_transactions).execute!
          invalid_records += 1
        end
      end

      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): #{progress}%%")
    end

    if invalid_records.any?
      puts "Repaired #{invalid_records} invalid records out of #{size}"
    else
      puts "No invalid records found."
    end

    puts "Done!"
  end

  task :reload_repayment_rates => :environment do
    repayment_rates = DataStore.repayment_rates

    size  = repayment_rates.size
    puts "Reloading #{size} RR data stores..."

    repayment_rates.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Reloading #{o.id}... #{progress}%%")

      args  = {
        id: o.id,
        data_store_type: "REPAYMENT_RATES"
      }

      ProcessRepaymentRates.perform_later(args)
    end

    puts "Done."
  end

  task :generate_missing_accounts => :environment do
    members = Member.all

    if ENV['BRANCH_ID'].present?
      members = members.where(branch_id: ENV['BRANCH_ID'])
    end

    if ENV['CENTER_ID'].present?
      members = members.where(center_id: ENV['CENTER_ID'])
    end

    if ENV['MEMBER_ID'].present?
      members = members.where(id: ENV['MEMBER_ID'])
    end

    size  = members.count

    members.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Generating missing accounts for member #{o.id}... #{progress}%%")

      ::Members::GenerateMissingAccounts.new(
        config: {
          member: o
        }
      ).execute!
    end

    puts "\nDone."
  end

  task :transfer_equity_value => :environment do
    members = Member.all

    if ENV['BRANCH_ID'].present?
      members = members.where(branch_id: ENV['BRANCH_ID'])
    end

    if ENV['MEMBER_ID'].present?
      members = members.where(id: ENV['MEMBER_ID'])
    end

    size  = members.count

    members.each_with_index do |member, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Transfering EV for member #{member.id}... #{progress}%%")

      life_account = member.member_accounts.where(account_subtype:"Life Insurance Fund").first
      ev_account   = member.member_accounts.where(account_subtype:"Equity Value").first

      if ev_account.present?
        ev_amount = life_account.balance / 2
        ev_account.update!(balance: ev_amount)

        @account_transaction  = AccountTransaction.new(
                                  subsidiary_id: ev_account.id,
                                  subsidiary_type: "MemberAccount",
                                  amount: ev_amount,
                                  transaction_type: "deposit",
                                  transacted_at: Date.today,
                                  status: "approved",
                                  data: {
                                    is_withdraw_payment: false,
                                    is_fund_transfer: false,
                                    is_interest: false,
                                    is_adjustment: false,
                                    is_for_exit_age: false,
                                    is_for_loan_payments: false,
                                    accounting_entry_reference_number: nil,
                                    beginning_balance: 0.00,
                                    ending_balance: ev_amount
                                  }
                                )

        @account_transaction.save!
      end
    end

    puts "\nDone."
  end

  task :update_maintaining_balance => :environment do
    members = Member.active

    if ENV['BRANCH_ID'].present?
      members = members.where(branch_id: ENV['BRANCH_ID'])
    end

    if ENV['CENTER_ID'].present?
      members = members.where(center_id: ENV['CENTER_ID'])
    end

    if ENV['MEMBER_ID'].present?
      members = members.where(id: ENV['MEMBER_ID'])
    end

    size  = members.count

    members.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Updating maintaining balance for member #{o.id}... #{progress}%%")

      ::Members::SetMaintainingBalance.new(
        config: {
          member: o
        }
      ).execute!
    end

    puts "\nDone."
  end

  task :entry_level_loan_cycle_counts => :environment do
    members = Member.active_and_resigned

    if ENV['BRANCH_ID'].present?
      members = members.where(branch_id: ENV['BRANCH_ID'])
    end

    if ENV['CENTER_ID'].present?
      members = members.where(center_id: ENV['CENTER_ID'])
    end

    if ENV['MEMBER_ID'].present?
      members = members.where(id: ENV['MEMBER_ID'])
    end

    size  = members.count

    members.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Updating loan cycle counts for member #{o.id}... #{progress}%%")

      data  = o.data.with_indifferent_access

      # --> Loan cycle computation
      loans               = Loan.active_or_paid.where(member_id: o.id)

      if o.is_returning?
        loans = loans.where("date_approved > ?", o.previous_date_resigned)
      end

      entry_loan_products = LoanProduct.entry_point.where(id: loans.pluck(:loan_product_id).uniq)
      loans               = loans.where(loan_product_id: entry_loan_products.pluck(:id)).order("date_approved ASC")

      loan_cycles = data[:loan_cycles] || []

      # Repair loan_cycles
      entry_loan_products.each do |elp|
        found = false

        loan_cycles.each do |lc|
          if lc[:loan_product_id] == elp.id
            found = true
          end
        end

        if !found
          loan_cycles << {
            loan_product_id: elp.id,
            cycle: loans.where(loan_product_id: elp.id).order("cycle ASC").count
          }

          start_counter = loan_cycles.last[:cycle].to_i - loans.where(loan_product_id: elp.id).count
          loans.where(loan_product_id: elp.id).order("date_approved ASC").each do |temp_loan|
            start_counter += 1
            temp_loan.update!(cycle: start_counter)
          end
        end
      end

      data[:loan_cycles]  = loan_cycles
      o.update!(data: data)

      data        = o.data.with_indifferent_access
      loan_cycles = data[:loan_cycles] || []

      if loan_cycles.any?
        loan_cycles.each do |lc|
          temp_loans  = loans.where(loan_product_id: lc[:loan_product_id]).order("date_approved ASC")

          if temp_loans.any?
            cycle_count     = lc[:cycle].to_i
            starting_cycle  = cycle_count - temp_loans.size

            temp_loans.each do |l|
              starting_cycle = starting_cycle + 1
              l.update!(cycle: starting_cycle)
            end
          end
        end
      end

      # --> Entry point loan cycle count
      #entry_point_loan_cycle  = data[:entry_point_loan_cycle] || 0
      entry_point_loan_cycle  = 0

      entry_loan_products.each do |lp|
        max_cycle_loan  = Loan.active_or_paid.where(member_id: o.id, loan_product_id: lp.id).order("cycle ASC").last

        if max_cycle_loan.present?
          entry_point_loan_cycle += max_cycle_loan.cycle.to_i
        end
      end

      data[:entry_point_loan_cycle] = entry_point_loan_cycle

      o.update!(data: data)
    end

    puts "\nDone."
  end

  task :update_recognition_date_by_loans => :environment do
    if ENV['INSURANCE_STATUS'].present? && ENV['STATUS'].present?
      members = Member.where(insurance_status: ENV['insurance_status'], status: ENV['STATUS'])
    else
      members = Member.active_and_resigned
    end

    if ENV['BRANCH_ID'].present?
      members = members.where(branch_id: ENV['BRANCH_ID'])
    end

    size  = members.count

    members.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Updating recognition date for insurance for member #{o.id}... #{progress}%%")

      data  = o.data.with_indifferent_access

      if data[:recognition_date].blank?
        earliest_loan = o.loans.active_or_paid.order("date_approved ASC").first

        if earliest_loan.present?
          data[:recognition_date] = earliest_loan.date_approved

          o.update!(data: data)
        end
      end
    end

    puts "\nDone."
  end

  task :update_previous_date_resigned => :environment do
    members = Member.active_and_resigned_and_pending

    if ENV['BRANCH_ID'].present?
      members = members.where(branch_id: ENV['BRANCH_ID'])
    end

    size  = members.count

    members.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Processing previous_date_resigned updates... #{progress}%%")

      data  = o.data.with_indifferent_access

      if data[:resignation_records].present? and data[:resignation_records].last.present?
        o.update!(
          previous_date_resigned: data[:resignation_records].last[:date_resigned]
        )
      end
    end

    puts "\nDone."
  end

  task :update_loan_maturity_dates => :environment do
    loans = Loan.active_or_paid.where(maturity_date: nil)

    if ENV['BRANCH_ID'].present?
      loans = loans.where(branch_id: ENV['BRANCH_ID'])
    end

    size  = loans.count

    loans.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Processing maturity date of loans... #{progress}%%")

      ::Loans::UpdateMaturityDate.new(
        loan: o
      ).execute!
    end

    puts "\nDone."
  end

  task :reload_new_and_resigned => :environment do
    start_date      = ENV['START_DATE'].to_date
    end_date        = ENV['END_DATE'].to_date
    branches        = Branch.all.order("name ASC")

    if ENV['BRANCH_ID'].present?
      branches  = branches.where(id: ENV['BRANCH_ID'])
    end

    data_store_type = "MONTHLY_NEW_AND_RESIGNED"

    branches.each do |branch|
      (start_date..end_date).each do |d|
        puts "Initiating monthly_new_and_resigned for branch #{branch.name} for as_of #{d}"

        record = DataStore.monthly_new_and_resigned.where(
                    "meta->>'branch_id' = ? AND CAST(meta->>'as_of' AS date) = ?",
                    branch.id,
                    d
                  ).first

        if record.blank?
          record  = DataStore.create!(
                      meta: {
                        branch_id: branch.id,
                        branch_name: branch.name,
                        branch: {
                          id: branch.id,
                          name: branch.name
                        },
                        as_of: d,
                        data_store_type: data_store_type
                      },
                      data: {
                        status: "processing"
                      }
                    )
        else
          record.update!(
            data: {
              status: "processing"
            }
          )
        end

        args  = {
          record: record,
          data_store_type: data_store_type,
          data_store_id: record.id,
          branch_id: branch.id,
          year: d.year,
          month: d.month
        }

        ProcessMonthlyNewAndResigned.perform_later(args)
      end
    end
  end

  task :reload_member_counts => :environment do
    start_date      = ENV['START_DATE'].to_date
    end_date        = ENV['END_DATE'].to_date
    branches        = Branch.all.order("name ASC")

    if ENV['BRANCH_ID'].present?
      branches  = branches.where(id: ENV['BRANCH_ID'])
    end

    data_store_type = "MEMBER_COUNTS"

    branches.each do |branch|
      (start_date..end_date).each do |d|
        puts "Initiating member_counts for branch #{branch.name} for as_of #{d}"

        record = DataStore.member_counts.where(
                    "meta->>'branch_id' = ? AND CAST(meta->>'as_of' AS date) = ?",
                    branch.id,
                    d
                  ).first

        if record.blank?
          record  = DataStore.create!(
                      meta: {
                        branch_id: branch.id,
                        branch_name: branch.name,
                        branch: {
                          id: branch.id,
                          name: branch.name
                        },
                        as_of: d,
                        data_store_type: data_store_type
                      },
                      data: {
                        status: "processing"
                      }
                    )
        else
          record.update!(
            data: {
              status: "processing"
            }
          )
        end

        args  = {
          record: record,
          data_store_type: data_store_type
        }

        ProcessBranchMemberCounts.perform_later(args)
      end
    end
  end

  task :perform_deposit => :environment do
    date_paid         = ENV['DATE_PAID'].to_date
    user              = User.find(ENV['USER_ID'])
    particular        = ENV['PARTICULAR']
    member            = Member.find(ENV['MEMBER_ID'])
    amount            = ENV['AMOUNT'].to_f
    record_type       = ENV['RECORD_TYPE']
    account_subtype   = ENV['ACCOUNT_SUBTYPE']
    member_account_id = ENV['MEMBER_ACCOUNT_ID']
    enabled           = true

    config  = {
      date_paid: date_paid,
      deposit: {
        amount: amount,
        enabled: enabled,
        member_id: member_id,
        record_type: record_type,
        account_subtype: account_subtype,
        member_account_id: member_account_id
      },
      member: member,
      user: user,
      particular: particular
    }

    puts "Performing deposit for account #{member_account_id}"

    ::DepositCollections::ApproveDepositHash.new(
      config: config
    ).execute!
  end

  task :perform_deposits => :environement do
    deposit_collection    = DepositCollection.find(ENV['ID'])
    user                  = User.find(ENV['USER_ID'])
    data_deposits         = deposit_collection.deposits
    data_accounting_entry = deposit_collection.accounting_entry
    date_approved         = deposit_collection.date_approved

    data_deposits.each do |o|
      config  = {
        date_paid: date_approved,
        deposit: o,
        member: Member.find(o[:member_id]),
        user: user,
        particular: data_accounting_entry[:particular]
      }

      puts "Performing deposit for account #{o[:member_account_id]}"

      ::DepositCollections::ApproveDepositHash.new(
        config: config
      ).execute!
    end

    puts "Done."
  end

  task :perform_withdrawals => :environment do
    withdrawal_collection = WithdrawalCollection.find(ENV['ID'])
    user                  = User.find(ENV['USER_ID'])
    data_withdrawals      = withdrawal_collection.withdrawals
    data_accounting_entry = withdrawal_collection.accounting_entry
    date_approved         = withdrawal_collection.date_approved

    data_withdrawals.each do |o|
      config  = {
        date_paid: date_approved,
        withdrawal: o,
        member: Member.find(o[:member_id]),
        user: user,
        particular: data_accounting_entry[:particular]
      }

      puts "Performing withdrawal for account #{o[:member_account_id]}"

      ::WithdrawalCollections::ApproveWithdrawalHash.new(
        config: config
      ).execute!
    end

    puts "Done."
  end

  task :upload_members_recognition_date => :environment do
    file_location = ENV['MEMBERS_CSV']
    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      identification_number = row['identification_number']
      recognition_date = row['recognition_date']

      member = Member.where(identification_number: identification_number).first

      if !member.nil?
        puts "Uploading recognition date: #{recognition_date} for #{member.full_name}"
        member_data = member.data.with_indifferent_access
        member_data[:recognition_date] = recognition_date
        member.update!(data: member_data)

        membership_payment = member.membership_payment_records.where(membership_type: "Insurance", membership_name: "K-MBA").order("date_paid ASC").last

        if membership_payment.present?
          membership_payment.update!(date_paid: recognition_date)
        end
      end
    end
    puts "Done!"
  end

  task :upload_members_associate_identification_number => :environment do
    #csv_format_header (identification_number,associate_identification_number)

    file_location = ENV['MEMBERS_CSV']
    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      identification_number = row['identification_number']
      associate_identification_number = row['associate_identification_number']

      member = Member.where(identification_number: identification_number).first

      if !member.nil?
        puts "Uploading associate id number for #{member.full_name}"
        member_data = member.data.with_indifferent_access
        member_data[:associate_identification_number] = associate_identification_number
        member.update!(data: member_data)
      end
    end

    puts "Done!"
  end

  task :update_member_branch_and_center => :environment do
    #header: identification_number, branch_id, center_name
    file_location = ENV['MEMBERS_CSV']
    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      identification_number = row['identification_number']
      branch_id = row['branch_id']

      member = Member.where(identification_number: identification_number).first

      if !member.nil?
        if row['center_name'].present?
          puts "Updating center: #{member.full_name}"

          center_name = row['center_name'].try(:upcase)
          center = Center.where("upper(name) = ? AND branch_id = ?", center_name, branch_id).first

          if center.nil?
            new_center = Center.new

            new_center.name = center_name.try(:upcase)
            new_center.short_name = center_name.try(:upcase)
            new_center.meeting_day = 1
            new_center.user = User.where(first_name: "kaiser").first
            new_center.branch = Branch.find(branch_id)
            new_center.save!

            member.update!(center: new_center)
          else
            member.update!(center: center)
          end
        end

        puts "Updating branch: #{member.full_name}"
        member.update!(branch_id: branch_id)
      end
    end
    puts "Done!"
  end


  task :repair_validation_accounting_entry_by_id => :environment do
    puts "Repairing ..."
    is_remote = false

    if ENV['IS_REMOTE'].present?
      is_remote = ENV['IS_REMOTE']
    end

    member_account_validation = MemberAccountValidation.find(ENV['VALIDATION_ID'])
    data = member_account_validation.data.with_indifferent_access
    last_name = member_account_validation.prepared_by.split(", ").first
    first_name = member_account_validation.prepared_by.split(", ").last
    current_user = User.where("lower(last_name) = ? AND lower(first_name) = ?", last_name.downcase, first_name.downcase).first
    data[:accounting_entry]  = ::MemberAccountValidations::BuildAccountingEntry.new(
                                        config:
                                        {
                                          branch: member_account_validation.branch,
                                          member_account_validation: member_account_validation,
                                          is_remote: is_remote,
                                          user: current_user
                                        }
                                ).execute!
    member_account_validation.data = data
    member_account_validation.save!

    puts "Done!"
  end


  task :repair_validation_accounting_entry => :environment do
    puts "Repairing ..."
    is_remote = true

    if ENV['IS_REMOTE'].present?
      is_remote = ENV['IS_REMOTE']
    end

    if ENV['VALIDATION_ID'].present?
      member_account_validations = MemberAccountValidation.where(id: ENV['VALIDATION_ID'])
    end

    member_account_validations = MemberAccountValidation.where("status != ? AND is_remote = ?", "approved", true)

    member_account_validations.each do |member_account_validation|
      if member_account_validation.data.present?
        puts "#{member_account_validation.id}"

        data = member_account_validation.data.with_indifferent_access

        last_name = member_account_validation.prepared_by.split(", ").first
        first_name = member_account_validation.prepared_by.split(", ").last
        current_user = User.where("lower(last_name) = ? AND lower(first_name) = ?", last_name.downcase, first_name.downcase).first

        if current_user.nil?
          if member_account_validation.branch.cluster.name == "CEBU CITY"
            current_user = User.find("61eeaa77-0288-47fa-a437-538a54740113")
          else
            current_user = User.find("d6050c1c-797b-497a-9ac5-e4a8726c6cbe")
          end
        end

        data[:accounting_entry]  = ::MemberAccountValidations::BuildAccountingEntry.new(
                                            config:
                                            {
                                              branch: member_account_validation.branch,
                                              member_account_validation: member_account_validation,
                                              is_remote: is_remote,
                                              user: current_user
                                            }
                                    ).execute!

        member_account_validation.data = data
        member_account_validation.save!
      end
    end

    puts "Done!"
  end

  task :upload_attachment_files_from_dir => :environment do
    dir_location  = ENV['DIR_LOCATION']
    puts "Searching in directory #{dir_location}"

    Dir["#{dir_location}/*"].each do |f|
      if File.directory? f
        sub_dir_name  = f.split('/').last

        member  = Member.where(identification_number: sub_dir_name).first

        if member
          if member.insurance_active?
            puts "Found directory for member #{member.full_name}"
            Dir["#{f}/*"].each do |ff|
              if !File.directory? ff
                filename  = ff.split('/').last.split('.').first

                attachments = member.attachment_files
                attachment = attachments.where(file_name: filename).first

                if attachment.nil?
                  if filename != "Thumbs"
                    attachment_file  = AttachmentFile.new(
                                        file_name: filename,
                                        member: member
                                     )

                    attachment_file.file.attach(io: File.open(ff), filename: '#{filename}.jpg', content_type: 'file/jpg')

                    if attachment_file.save
                      puts "Successfully uploaded file #{ff} for #{member.identification_number} #{filename}"
                    else
                      puts "Error in attaching file #{ff}"
                      puts attachment_file.errors.full_messages
                    end
                  end
                else
                  attachment.file.purge
                  attachment.file.attach(io: File.open(ff), filename: '#{filename}.jpg', content_type: 'file/jpg')
                  attachment.update(
                    file_name: filename,
                    member: member,
                    )
                  puts "Successfully updated file #{ff} for #{member.identification_number}"
                end
              end
            end
          end
        else
          puts "Member #{sub_dir_name} not found"
        end
      end
    end
  end

  task :destroy_thumbs_attachment_file => :environment do
    puts "Destroying thumbs file ..."
    AttachmentFile.where("file_name IN (?)", ["Thumbs", "thumbs"]).each do |af|
      if af.file.present?
        puts "Destroying file of #{af.member_id}"
        af.file.purge
        af.destroy!
      end
    end
    puts "Done!"
  end

  task :destroy_resigned_members_attachment_files => :environment do
    puts "Destroying files ..."

    if ENV['BRANCH_ID'].present?
      branches = Branch.where(id: ENV['BRANCH_ID'])
    end

    branches = Branch.all

    branches.each do |branch|
      puts "Deleting files for #{branch.name}"

      members = Member.where(branch_id: branch.id, insurance_status: "resigned")

      members.each do |member|
        member.attachment_files.each do |af|
          if af.file.present?
            af.file.purge
            af.destroy!
          end
        end
      end
    end

    puts "Done!"
  end

  # task :update_insurance_status_extended_grace_period => :environment do
  #   current_date = Date.today

  #   if ENV['CURRENT_DATE'].present?
  #     current_date = ENV['CURRENT_DATE'].to_date
  #   end

  #   result  = ActiveRecord::Base.connection.execute(<<-EOS).to_a
  #               SELECT DISTINCT ON(member_accounts.id)
  #                 member_accounts.id AS member_account_id,
  #                 member_accounts.account_type,
  #                 member_accounts.account_subtype,
  #                 account_transactions.id AS transaction_id,
  #                 account_transactions.transacted_at,
  #                 COALESCE(account_transactions.data->>'ending_balance', '0.00')::float AS balance,
  #                 account_transactions.data->>'is_withdraw_payment' AS is_withdraw_payment,
  #                 members.data->>'recognition_date' AS recognition_date,
  #                 members.id AS member_id,
  #                 members.member_type,
  #                 members.status,
  #                 members.insurance_status,
  #                 members.insurance_date_resigned,
  #                 COUNT(account_transactions) AS acc_trans_count
  #               FROM
  #                 member_accounts
  #               LEFT JOIN
  #                 account_transactions ON account_transactions.subsidiary_id = member_accounts.id
  #               LEFT JOIN
  #                 members ON members.id = member_accounts.member_id
  #               WHERE
  #                 member_accounts.account_type = 'INSURANCE' AND member_accounts.account_subtype = 'Life Insurance Fund'
  #               GROUP BY
  #                 member_account_id,
  #                 transaction_id,
  #                 recognition_date,
  #                 members.id
  #               ORDER BY
  #                 member_accounts.id, account_transactions.transacted_at DESC
  #             EOS

  #   sets  = result.map{ |o|
  #             member_id                 = o.fetch("member_id")
  #             default_periodic_payment  = 15
  #             recognition_date          = o.fetch("recognition_date").try(:to_date)
  #             transactions_count        = o.fetch("acc_trans_count")

  #             new_status  = "dormant"
  #             insurance_status  = o.fetch("insurance_status")
  #             insurance_date_resigned  = o.fetch("insurance_date_resigned")
  #             status      = o.fetch("status")
  #             member_type = o.fetch("member_type")
  #             last_payment_date = o.fetch("transacted_at").try(:to_date)

  #             if recognition_date.present? and last_payment_date.present?
  #               # Code
  #               if transactions_count > 0
  #                 current_balance         = o.fetch("balance").to_f.round(2)
  #                 num_days                = (current_date - recognition_date).to_i
  #                 num_weeks               = (num_days / 7).to_i + 1
  #                 insured_amount          = num_weeks * default_periodic_payment
  #                 amt_past_due            = (current_balance - insured_amount).to_i * -1
  #                 days_lapsed             = (current_date - last_payment_date).to_i

  #                 is_withdraw_payment = o.fetch("is_withdraw_payment")

  #                 if o.fetch("balance").to_f.round(2) == 0.00 && insurance_status == "resigned"
  #                   new_status = "resigned"
  #                 elsif current_balance == 0.00 && is_withdraw_payment == "true"
  #                   new_status = "resigned"
  #                 elsif current_balance == 0.00 && !insurance_date_resigned.nil?
  #                   new_status = "resigned"
  #                 elsif days_lapsed <= 76 && current_balance < insured_amount && amt_past_due >= 163 && insurance_status != "resigned"
  #                   new_status = "lapsed"
  #                 elsif days_lapsed > 76 && current_balance < insured_amount && amt_past_due >= 163 && insurance_status != "resigned"
  #                   new_status = "lapsed"
  #                 elsif days_lapsed <= 76 && current_balance >= insured_amount && insurance_status != "resigned"
  #                   new_status = "inforce"
  #                 elsif days_lapsed > 76 && current_balance >= insured_amount && insurance_status != "resigned"
  #                   new_status = "inforce"
  #                 elsif days_lapsed <= 76 && current_balance < insured_amount && amt_past_due < 163 && insurance_status != "resigned"
  #                   new_status = "inforce"
  #                 elsif days_lapsed > 76 && current_balance < insured_amount && amt_past_due < 163 && insurance_status != "resigned"
  #                   new_status = "inforce"
  #                 end
  #               else
  #                 new_status = "dormant"
  #               end
  #             elsif recognition_date.present? and transactions_count == 0
  #               new_status = "dormant"
  #             else
  #               new_status = "pending"
  #             end

  #             if member_type == "GK"
  #               new_status = "resigned"
  #             elsif status == "active" && recognition_date.nil?
  #               new_status = "pending"
  #             elsif status == "pending"
  #               new_status = "pending"
  #             elsif status == "archived"
  #               new_status = "archived"
  #             elsif status == "cleared"
  #               new_status = "cleared"
  #             elsif status == "resigned" && !insurance_date_resigned.nil?
  #               new_status = "resigned"
  #             end

  #             "('#{member_id}', '#{new_status}')"
  #           }.join(",")

  #   query = "
  #     UPDATE members AS m SET
  #       insurance_status = c.new_status
  #     FROM (values
  #       #{sets}
  #     ) AS c(member_id, new_status)
  #     WHERE c.member_id = m.id::text
  #   "

  #   ActiveRecord::Base.connection.execute(query)

  #   puts "Done."
  # end

  task :update_insurance_status => :environment do

    current_date = Date.today

    if ENV['CURRENT_DATE'].present?
      current_date = ENV['CURRENT_DATE'].to_date
    end

    if ENV['BRANCH_ID'].present?
      branches = Branch.where(id: ENV['BRANCH_ID'])
    else
      branches = Branch.all.order("member_counter ASC")
    end

    branches.all.each do |branch|

      if branch.member_counter != 0
        puts "Updating #{branch.name} ..."
        result  = ActiveRecord::Base.connection.execute(<<-EOS).to_a
                    SELECT DISTINCT ON(member_accounts.id)
                      member_accounts.id AS member_account_id,
                      member_accounts.account_type,
                      member_accounts.account_subtype,
                      COALESCE(member_accounts.balance, '0.00')::float AS ma_balance,
                      account_transactions.id AS transaction_id,
                      account_transactions.transacted_at,
                      COALESCE(account_transactions.data->>'ending_balance', '0.00')::float AS balance,
                      account_transactions.data->>'is_withdraw_payment' AS is_withdraw_payment,
                      members.data->>'recognition_date' AS recognition_date,
                      members.data->'reinstatement'->>'reinstatement_date' AS reinstatement_date,
                      members.data->'reinstatement'->>'old_recognition_date' AS old_recognition_date,
                      members.data->'reinstatement'->>'date_stop' as date_stop,
                      members.id AS member_id,
                      members.member_type,
                      members.status,
                      members.insurance_status,
                      members.insurance_date_resigned,
                      COUNT(account_transactions) AS acc_trans_count
                    FROM
                      member_accounts
                    LEFT JOIN
                      account_transactions ON account_transactions.subsidiary_id = member_accounts.id
                    LEFT JOIN
                      members ON members.id = member_accounts.member_id
                    WHERE
                      member_accounts.account_type = 'INSURANCE' AND member_accounts.account_subtype = 'Life Insurance Fund' AND members.branch_id = '#{branch.id}'
                    GROUP BY
                      member_account_id,
                      transaction_id,
                      recognition_date,
                      members.id
                    ORDER BY
                      member_accounts.id, account_transactions.transacted_at DESC
                  EOS

        sets  = result.map{ |o|
                  member_id                       = o.fetch("member_id")
                  default_periodic_payment        = 15
                  recognition_date                = o.fetch("recognition_date").try(:to_date)
                  transactions_count              = o.fetch("acc_trans_count")
                  reinstatement_date               = o.fetch("reinstatement_date").try(:to_date)

                  new_status  = "pending"
                  insurance_status  = o.fetch("insurance_status")
                  insurance_date_resigned  = o.fetch("insurance_date_resigned")
                  status      = o.fetch("status")
                  member_type = o.fetch("member_type")
                  last_payment_date = o.fetch("transacted_at").try(:to_date)
                  #current_balance   = o.fetch("balance").to_f.round(2)
                  current_balance   = o.fetch("ma_balance").to_f.round(2)

                  puts "ID: #{member_id}"
                  puts "current_balance: #{current_balance}"
                  #puts "ma_current_balance: #{ma_current_balance}"
                  puts "last_payment_date: #{last_payment_date}"
                  puts "current_date: #{current_date}"
                  puts "recognition_date: #{recognition_date}"
                  puts "transactions_count: #{transactions_count}"
                  puts "insurance_date_resigned: #{insurance_date_resigned}"
                  puts "status: #{status}"

                  if reinstatement_date.present?
                    if transactions_count > 0
                      num_days                = (current_date - reinstatement_date).to_i
                      num_weeks               = (num_days / 7).to_i + 1
                      insured_amount          = num_weeks * default_periodic_payment
                      amt_past_due            = (current_balance - insured_amount).to_i * -1
                      days_lapsed             = (current_date - last_payment_date).to_i

                      if member_type == "GK"
                        new_status = "resigned"
                      end

                      if current_balance == 0.0 && insurance_status == "resigned"
                        new_status = "resigned"
                      end

                      if status == "resigned" && current_balance == 0.0
                        new_status = "resigned"
                      end

                      if status == "archived" && current_balance == 0.0
                        new_status = "transferred"
                      end

                      if current_balance == 0.0 && insurance_date_resigned.present?
                        new_status = "resigned"
                      end

                      if status == "resigned" && insurance_date_resigned.present? && current_balance == 0.0
                        new_status = "resigned"
                      end

                      if amt_past_due >= 2340 && insurance_status != "resigned" && current_balance > 0.0 && member_type != "GK"
                        if amt_past_due >= 2340
                          new_status = "dormant"
                        end
                      end

                      if days_lapsed <= 45 && current_balance < insured_amount && amt_past_due >= 97 && amt_past_due < 2340 && insurance_status != "resigned" && current_balance > 0.0 && member_type != "GK"
                        new_status = "lapsed"
                      end

                      if days_lapsed > 45 && current_balance < insured_amount && amt_past_due >= 97 && amt_past_due < 2340 && insurance_status != "resigned" && current_balance > 0.0 && member_type != "GK"
                        new_status = "lapsed"
                      end

                      if days_lapsed <= 45 && current_balance >= insured_amount && insurance_status != "resigned" && member_type != "GK"
                        new_status = "inforce"
                      end

                      if days_lapsed > 45 && current_balance >= insured_amount && insurance_status != "resigned" && member_type != "GK"
                        new_status = "inforce"
                      end

                      if days_lapsed <= 45 && current_balance < insured_amount && amt_past_due < 97 && insurance_status != "resigned" && member_type != "GK"
                        new_status = "lapsed"
                      end

                      if days_lapsed > 45 && current_balance < insured_amount && amt_past_due < 97 && insurance_status != "resigned" && member_type != "GK"
                        new_status = "inforce"
                      end
                    end
                  elsif recognition_date.present? and last_payment_date.present?
                    # Code
                    if transactions_count > 0
                      num_days                = (current_date - recognition_date).to_i
                      num_weeks               = (num_days / 7).to_i + 1
                      insured_amount          = num_weeks * default_periodic_payment
                      amt_past_due            = (current_balance - insured_amount).to_i * -1
                      days_lapsed             = (current_date - last_payment_date).to_i

                      if member_type == "GK"
                        new_status = "resigned"
                      end

                      if current_balance == 0.0 && insurance_status == "resigned"
                        new_status = "resigned"
                      end

                      if status == "resigned" && current_balance == 0.0
                        new_status = "resigned"
                      end

                      if status == "archived" && current_balance == 0.0
                        new_status = "transferred"
                      end

                      if current_balance == 0.0 && insurance_date_resigned.present?
                        new_status = "resigned"
                      end

                      if status == "resigned" && insurance_date_resigned.present? && current_balance == 0.0
                        new_status = "resigned"
                      end

                      if amt_past_due >= 2340 && insurance_status != "resigned" && current_balance > 0.0 && member_type != "GK"
                        if amt_past_due >= 2340
                          new_status = "dormant"
                        end
                      end

                      if days_lapsed <= 45 && current_balance < insured_amount && amt_past_due >= 97 && amt_past_due < 2340 && insurance_status != "resigned" && current_balance > 0.0 && member_type != "GK"
                        new_status = "lapsed"
                      end

                      if days_lapsed > 45 && current_balance < insured_amount && amt_past_due >= 97 && amt_past_due < 2340 && insurance_status != "resigned" && current_balance > 0.0 && member_type != "GK"
                        new_status = "lapsed"
                      end

                      if days_lapsed <= 45 && current_balance >= insured_amount && insurance_status != "resigned" && member_type != "GK"
                        new_status = "inforce"
                      end

                      if days_lapsed > 45 && current_balance >= insured_amount && insurance_status != "resigned" && member_type != "GK"
                        new_status = "inforce"
                      end

                      if days_lapsed <= 45 && current_balance < insured_amount && amt_past_due < 97 && insurance_status != "resigned" && member_type != "GK"
                        new_status = "inforce"
                      end

                      if days_lapsed > 45 && current_balance < insured_amount && amt_past_due < 97 && insurance_status != "resigned" && member_type != "GK"
                        new_status = "inforce"
                      end
                    end

                  elsif status == "archived" && current_balance == 0.0
                    new_status = "transferred"

                  elsif status == "resigned" && current_balance == 0.0
                    new_status = "resigned"

                  else
                    new_status = "pending"
                  end

                  puts "insurance_status: #{new_status}"
                  puts "\n"

                  "('#{member_id}', '#{new_status}')"
                }.join(",")

         if sets.present?
          query = "
            UPDATE members AS m SET
              insurance_status = c.new_status
            FROM (values
              #{sets}
            ) AS c(member_id, new_status)
            WHERE c.member_id = m.id::text
          "

          ActiveRecord::Base.connection.execute(query)
        end

        puts "Done."
      end
    end
  end

  task :update_member_insurance_status => :environment do
    puts "Updating member insurance status"

    if ENV['BRANCH_ID'].present?
      members = Member.where(branch_id: ENV['BRANCH_ID'])
    else
      members = Member.all
    end

    if ENV['CURRENT_DATE'].present?
      current_date = ENV['CURRENT_DATE'].to_date
    else
      current_date = Date.today
    end

    size  = members.size

    member_accounts = MemberAccount.where("account_subtype = ? AND member_id IN (?)", "Life Insurance Fund", members.pluck(:id))
    account_transactions = AccountTransaction.savings.where("amount > 0 AND subsidiary_id IN (?)", member_accounts.pluck(:id))

    members.each_with_index do |member, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Validating #{member.id}... #{progress}%%")

      puts "Updating #{member.id} - #{member.full_name}"
      default_periodic_payment  = 15
      recognition_date          = member.recognition_date

      if recognition_date.present?
        current_member_account = member_accounts.select{ |o| o.member_id == member.id }.first
        if !current_member_account.nil?
          transactions = account_transactions.select{ |o| o.subsidiary_id == current_member_account.id }

          if transactions.any?
            # latest_payment    = member_accounts
            latest            = transactions.last
            last_payment_date = transactions.last[:transacted_at].to_date
            # Code
            current_balance          = current_member_account.balance.to_i
            num_days                 = (current_date - recognition_date).to_i
            num_weeks                = (num_days / 7).to_i + 1
            insured_amount           = num_weeks * default_periodic_payment
            amt_past_due             = (current_balance - insured_amount).to_i * -1
            # num_weeks_past_due       = (amt_past_due / default_periodic_payment)
            days_lapsed              = (current_date - last_payment_date).to_i

            if current_balance == 0.00 && latest.data.with_indifferent_access[:is_withdraw_payment] == true
              member.update(insurance_status: "resigned")
            elsif current_balance == 0.00
              member.update(insurance_status: "dormant")
            elsif days_lapsed <= 45 && current_balance < insured_amount && amt_past_due >= 97
              member.update(insurance_status: "lapsed")
            elsif days_lapsed > 45 && current_balance < insured_amount && amt_past_due >= 97
              member.update(insurance_status: "lapsed")
            elsif days_lapsed <= 45 && current_balance >= insured_amount
              member.update(insurance_status: "inforce")
            elsif days_lapsed > 45 && current_balance >= insured_amount
              member.update(insurance_status: "inforce")
            elsif days_lapsed <= 45 && current_balance < insured_amount && amt_past_due < 97
              member.update(insurance_status: "inforce")
            elsif days_lapsed > 45 && current_balance < insured_amount && amt_past_due < 97
              member.update(insurance_status: "inforce")
            end
          elsif transactions.size == 0
            member.update(insurance_status: "dormant")
          end
        end
      else
        member.update(insurance_status: "pending")
      end

      if member.member_type == "GK"
        member.update(insurance_status: "resigned")
      elsif member.status == "resigned"
        if member.recognition_date.nil?
          member.update(insurance_status: "pending")
        else
          member.update(insurance_status: "resigned")
        end
      elsif member.status == "pending"
        member.update(insurance_status: "pending")
      elsif member.status == "archived"
        member.update(insurance_status: "dormant")
      elsif member.status == "cleared"
        member.update(insurance_status: "cleared")
      end
    end
    puts "Done!"
  end

  task :insert_child_as_legal_dependent => :environment do
    file_location = ENV['MEMBERS_CSV']
    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      identification_number = row['identification_number']
      member = Member.where(identification_number: identification_number).first
      record = LegalDependent.where(first_name: row['first_name'], middle_name: row['middle_name'], last_name: row['last_name']).first

      if record.nil?
        legal_dependent = LegalDependent.new
        legal_dependent.first_name = row['first_name']
        legal_dependent.middle_name = row['middle_name']
        legal_dependent.last_name = row['last_name']
        legal_dependent.date_of_birth = row['dob']
        # legal_dependent.relationship = 'Child'
        legal_dependent.member_id = member.id

        legal_dependent.save!
      else
        record.update!(date_of_birth: row['dob'])
      end
      puts "Updating dependents of #{identification_number}...#{member.full_name}..."
    end
  end

  task :update_member_date_of_birth => :environment do
    file_location = ENV['MEMBERS_CSV']
    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      identification_number = row['identification_number']
      member = Member.where(identification_number: identification_number).first
      dob = row['dob'].to_date

      puts "Updating #{identification_number}...#{member.full_name}"

      if !member.nil?
        member.update!(date_of_birth: dob)
      end
    end
  end

  task :update_member_mobile_number => :environment do
    file_location = ENV['MEMBERS_CSV']
    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      identification_number = row['identification_number']
      member = Member.where(identification_number: identification_number).first
      mobile_number = row['mobile_number']

      puts "Updating #{identification_number}...#{member.full_name}"

      if !member.nil?
        member.update!(mobile_number: mobile_number)
      end
    end
  end

  task :update_member_id => :environment do
    file_location = ENV['MEMBERS_CSV']
    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      identification_number = row['identification_number']
      member = Member.where(identification_number: identification_number).first

      puts "Updating #{identification_number}...#{member.full_name}"

      if !member.nil?
        member.update!(id: row['uuid'])
      end
    end
  end

  task :update_member_civil_status => :environment do
    file_location = ENV['MEMBERS_CSV']
    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      identification_number = row['identification_number']
      member = Member.where(identification_number: identification_number).first

      puts "Updating #{identification_number}...#{member.full_name}"

      if !member.nil?
        member.update!(civil_status: row['civil_status'])
      end
    end
  end

  task :load_insurance_account_transactions => :environment do
    file_location = ENV["FILE_LOCATION"]
    puts "Searching file #{file_location}"

    insurance_account_ids = []

    CSV.foreach(file_location, headers: true) do |row|
      uuid = row['id']
      insurance_account_transaction = AccountTransaction.where(id: uuid).first

      if insurance_account_transaction.nil?
        puts "Creating new insurance account transaction record #{uuid}..."

        insurance_account_transaction = AccountTransaction.new

        insurance_account_transaction_data = JSON.parse(row['data'])

        insurance_account_transaction.id = uuid
        insurance_account_transaction.subsidiary_id = row['subsidiary_id']
        insurance_account_transaction.subsidiary_type = row['subsidiary_type']
        insurance_account_transaction.amount = row['amount']
        insurance_account_transaction.transaction_type = row['transaction_type']
        insurance_account_transaction.transacted_at = row['transacted_at']
        insurance_account_transaction.status = row['status']
        insurance_account_transaction.data = insurance_account_transaction_data
        insurance_account_transaction.created_at = row['created_at']
        insurance_account_transaction.updated_at = row['updated_at']

        insurance_account_transaction.save!
        puts "Done creating!"

        insurance_account_ids << row['subsidiary_id']
      else
        puts "Updating existing insurance account transaction record #{uuid}..."

        insurance_account_transaction_data = JSON.parse(row['data'])

        insurance_account_transaction.update!(
          subsidiary_id: insurance_account_transaction.subsidiary_id,
          subsidiary_type: row['subsidiary_type'],
          amount: row['amount'],
          transaction_type: row['transaction_type'],
          transacted_at: row['transacted_at'],
          status: row['status'],
          data: insurance_account_transaction_data,
          created_at: row['created_at'],
          updated_at: row['updated_at']
        )

        puts "Done updating!"

        insurance_account_ids << insurance_account_transaction.subsidiary_id
      end
    end

    insurance_account_ids = insurance_account_ids.uniq

    insurance_account_id = insurance_account_ids.first
    branch = MemberAccount.where(id: insurance_account_id).first.member.branch

    # Rehash accounts
    puts "Rehashing ..."
    ::MemberAccounts::BulkRehash.new(
      config: {
          branch: branch
        }
    ).execute!

    # Rehash accounts
    # puts "Rehashing ..."
    # account_transactions = AccountTransaction.savings.where("amount > 0 AND subsidiary_id IN (?) AND status = ?", insurance_account_ids, "approved")

    # MemberAccount.where(id: insurance_account_ids, account_type: "INSURANCE").each do |member_account|
    #   ::MemberAccounts::Rehash.new(member_account: member_account, account_transactions: account_transactions).execute!
    # end

    puts "Done!"
  end

  task :void_validation_record_by_ids => :environment do
    puts "Updating ..."
    member_account_validation_record = MemberAccountValidation.find(ENV['MEMBER_ACCOUNT_VALIDATION_ID']).member_account_validation_records.where("member_id = ? AND data ->> 'is_void' = ?", ENV['MEMBER_ID'], 'false').order("created_at ASC").last
    member_account_validation_record_data = member_account_validation_record.data.with_indifferent_access
    member_account_validation_record_data[:is_void] = true
    member_account_validation_record.update!(data: member_account_validation_record_data)
    puts "Done"
  end

  task :void_validation_record_of_balik_kasapi => :environment do
    puts "Updating ..."
    Member.active.each do |member|
      if member.data.with_indifferent_access[:restoration_records].present?
        member_account_validation_record = MemberAccountValidationRecord.where("member_id = ? AND data ->> 'is_void' = ?", member.id, 'false').order("created_at ASC").last
        if !member_account_validation_record.nil?
          puts "Voiding member account validation record of #{member.full_name}"
          member_account_validation_record_data = member_account_validation_record.data.with_indifferent_access
          member_account_validation_record_data[:is_void] = true
          member_account_validation_record.update!(data: member_account_validation_record_data)
        end
      end
    end
    puts "Done"
  end

  task :update_center_name => :environment do
    file_location = ENV['CENTERS_CSV']
    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      center = Center.find(row['center_id'])

      if !center.nil?
        puts "Updating: #{center.name}"
        center.update!(name: row['center_name'])
      end
    end
    puts "Done!"
  end

  task :update_identification_number_by_uuid => :environment do
    file_location = ENV['MEMBERS_CSV']
    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      member = Member.find(row['uuid'])

      if !member.nil?
        puts "Updating: #{member.full_name}"
        member.update!(identification_number: row['identification_number'])
      end
    end
    puts "Done!"
  end

  task :repair_members_member_accounts => :environment do
    puts "Repairing ..."

    members = Member.all

    members.each do |member|
      puts "Updating: #{member.full_name}"
      center = member.center
      branch = member.branch

      MemberAccount.where(member_id: member.id).each do |a|
        a.update!(center: center, branch: branch)
      end
    end
    puts "Done!"
  end

  task :update_insurance_date_resigned_using_file => :environment do
    file_location = ENV['MEMBERS_CSV']
    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      member = Member.find(row['uuid'])

      if !member.nil?
        if member.resigned?
          puts "Updating: #{member.full_name}"
          member.update!(insurance_date_resigned: row['insurance_date_resigned'].to_date)
        end
      end
    end
    puts "Done!"
  end

  task :update_insurance_date_resigned => :environment do
    members = Member.where(insurance_status: "resigned")

    size  = members.count

    members.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Updating insurance date resigned of member #{o.full_name}... #{progress}%%")

      data  = o.data.with_indifferent_access

      if data[:insurance_resignation].present?
        data_insurance_date_resigned = data[:insurance_resignation][:date_resigned]
        o.update!(insurance_date_resigned: data_insurance_date_resigned)
      else
        insurance_date_resigned = o.date_resigned
        o.update!(insurance_date_resigned: insurance_date_resigned)
      end
    end

    puts "\nDone."
  end

  task :update_accounting_entry => :environment do
    member_account_validation = MemberAccountValidation.approved.all
    current_user = User.first
    member_account_validation.where(data: nil).each do |o|
      data = { accounting_entry: ::MemberAccountValidations::BuildAccountingEntryForImport.new(
                config:
                {
                  user: current_user,
                  member_account_validation: o,
                  is_remote: o.is_remote,
                  branch: o.branch,
                  status: o.status,
                  reference_number: o.reference_number,
                  approved_by: o.approved_by
                }
              ).execute!
            }
      o.update!(data: data)
    end
  end

  task :process_insurance_member_counts => :environment do
    @data_store_type  = "INSURANCE_MEMBER_COUNTS"
    @as_of            = Date.today

    if ENV['CURRENT_DATE'].present?
      @as_of = ENV['CURRENT_DATE'].to_date
    end

    @branches         = Branch.all

    @branches.each do |branch|

      puts "Processing #{branch.name}"

      @record = DataStore.insurance_member_counts.where(
                  "meta->>'branch_id' = ? AND CAST(meta->>'as_of' AS date) = ?",
                  branch.id,
                  @as_of
                ).first

      if @record.blank?
        @record = DataStore.create!(
                    meta: {
                      branch_id: branch.id,
                      branch_name: branch.name,
                      branch: {
                        id: branch.id,
                        name: branch.name
                      },
                      as_of: @as_of,
                      data_store_type: @data_store_type
                    },
                    data: {
                      status: "processing"
                    }
                  )

        args  = {
          record: @record,
          data_store_type: @data_store_type
        }

        ProcessInsuranceBranchMemberCounts.perform_later(args)
      end

      puts "Done!"
    end
  end

  task :process_member_quarterly_reports => :environment do
    @data_store_type  = "MEMBER QUARTERLY REPORTS"
    @as_of            = Date.today

    @start_date = Date.today.beginning_of_year
    @end_date = @as_of.end_of_month


    if ENV['CURRENT_DATE'].present?
      @as_of = ENV['CURRENT_DATE'].to_date
    end

    @branches         = Branch.find("ff757405-81b9-4fba-a3f6-9a7903789295")

      puts "Processing #{@branches.name}"

      @record = DataStore.member_quarterly_reports.where(
                  "meta->>'branch_id' = ? AND CAST(meta->>'as_of' AS date) = ?",
                  @branches.id,
                  @as_of
                ).first

      if @record.blank?
        @record = DataStore.create!(
                    meta: {
                      branch_id: @branches.id,
                      branch_name: @branches.name,
                      branch: {
                        id: @branches.id,
                        name: @branches.name
                      },
                      as_of: @as_of,
                      data_store_type: @data_store_type,
                      start_date: @start_date,
                      end_date: @end_date
                    },
                    data: {
                      status: "processing"
                    }
                  )

        args  = {
          record: @record,
          data_store_type: @data_store_type
        }

        ProcessMemberQuarterlyReports.perform_later(args)
      end

      puts "Done!"
  end

  # task :process_member_quarterly_reports => :environment do
  #   @data_store_type  = "MEMBER QUARTERLY REPORTS"
  #   @as_of            = Date.today

  #   puts "Processing"

  #     @record = DataStore.member_quarterly_reports.where(
  #                 "CAST(meta->>'as_of' AS date) = ?",
  #                 # branch.id,
  #                 @as_of
  #               ).first

  #     if @record.blank?
  #       @record = DataStore.create!(
  #                   meta: {
  #                     # branch_id: branch.id,
  #                     # branch_name: branch.name,
  #                     # branch: {
  #                     #   id: branch.id,
  #                     #   name: branch.name
  #                     # },
  #                     as_of: @as_of,
  #                     data_store_type: @data_store_type
  #                   },
  #                   data: {
  #                     status: "processing"
  #                   }
  #                 )

  #       args  = {
  #         record: @record,
  #         data_store_type: @data_store_type
  #       }


  #       ProcessMemberQuarterlyReports.perform_later(args)
  #     end
  #   puts "Done!"
  # end



  task :process_personal_funds => :environment do
    @data_store_type  = "PERSONAL_FUNDS"
    @as_of            = Date.today
    @branches         = Branch.all

    if ENV['CURRENT_DATE'].present?
      @as_of = ENV['CURRENT_DATE'].to_date
    end

    @branches.each do |branch|

      puts "Processing #{branch.name}"

      @record = DataStore.personal_funds.where(
                "meta->>'branch_id' = ? AND CAST(meta->>'as_of' AS date) = ?",
                branch.id,
                @as_of
              ).first

      if @record.blank?
        @record = DataStore.create!(
                  meta: {
                    branch_id: branch.id,
                    branch_name: branch.name,
                    as_of: @as_of,
                    data_store_type: @data_store_type,
                    progress: 0
                  },
                  data: {
                    status: "processing"
                  }
                )

        args  = {
          id: @record.id,
          data_store_type: @data_store_type
        }

        ProcessPersonalFunds.perform_later(args)
      end
      puts "Done!"
    end
  end

  task :process_claims_counts => :environment do
    @data_store_type  = "CLAIMS_COUNTS"
    @as_of            = Date.today
    @branches         = Branch.all

    if ENV['CURRENT_DATE'].present?
      @as_of = ENV['CURRENT_DATE'].to_date
    end

    @branches.each do |branch|

      puts "Processing #{branch.name}"

      @record = DataStore.claims_counts.where(
                      "meta->>'branch_id' = ? AND CAST(meta->>'as_of' AS date) = ?",
                      branch.id,
                      @as_of
                    ).first

      if @record.blank?
        @record = DataStore.create!(
                    meta: {
                      branch_id: branch.id,
                      branch_name: branch.name,
                      branch: {
                        id: branch.id,
                        name: branch.name
                      },
                      as_of: @as_of,
                      data_store_type: @data_store_type
                    },
                    data: {
                      status: "processing"
                    }
                  )

        args  = {
          record: @record,
          data_store_type: @data_store_type
        }

        ProcessClaimsCounts.perform_later(args)
      end
      puts "Done!"
    end
  end

  task :process_uploaded_documents_counts => :environment do
    @data_store_type  = "UPLOADED_DOCUMENTS_COUNTS"
    # live code
    @as_of            = Date.today
    # for 1st Quarter
    # @start_date = Date.today.beginning_of_year
    # @as_of = @start_date.end_of_quarter
    @branches         = Branch.all

    if ENV['CURRENT_DATE'].present?
      @as_of = ENV['CURRENT_DATE'].to_date
    end

    @branches.each do |branch|

      puts "Processing #{branch.name}"

      @record = DataStore.uploaded_documents_counts.where(
                      "meta->>'branch_id' = ? AND CAST(meta->>'as_of' AS date) = ?",
                      branch.id,
                      @as_of
                    ).first

      if @record.blank?
        @record = DataStore.create!(
                    meta: {
                      branch_id: branch.id,
                      branch_name: branch.name,
                      branch: {
                        id: branch.id,
                        name: branch.name
                      },
                      as_of: @as_of,
                      data_store_type: @data_store_type
                    },
                    data: {
                      status: "processing"
                    }
                  )

        args  = {
          record: @record,
          data_store_type: @data_store_type
        }

        ProcessUploadedDocumentsCounts.perform_later(args)
      end
      puts "Done!"
    end
  end

  task :process_member_per_center_counts => :environment do
    @data_store_type  = "MEMBER PER CENTER COUNTS"
    @as_of            = Date.today


    if ENV['CURRENT_DATE'].present?
      @as_of = ENV['CURRENT_DATE'].to_date
    end

    # @branches.each do |branch|
    branch         = Branch.find("3a74c7d5-54a5-4eec-826d-ab81f76ae31a")
      puts "Processing #{branch.name}"

      @record = DataStore.member_per_center_counts.where(
                      "meta->>'branch_id' = ? AND CAST(meta->>'as_of' AS date) = ?",
                      branch.id,
                      @as_of
                    ).first

      if @record.blank?
        @record = DataStore.create!(
                    meta: {
                      branch_id: branch.id,
                      branch_name: branch.name,
                      branch: {
                        id: branch.id,
                        name: branch.name
                      },
                      as_of: @as_of,
                      data_store_type: @data_store_type
                    },
                    data: {
                      status: "processing"
                    }
                  )

        args  = {
          record: @record,
          data_store_type: @data_store_type
        }

        ProcessMemberPerCenterCounts.perform_later(args)
      end
      puts "Done!"

  end


  task :process_insurance_personal_funds => :environment do
    @data_store_type  = "INSURANCE_PERSONAL_FUNDS"
    @as_of            = Date.today
    @branches         = Branch.all

    if ENV['CURRENT_DATE'].present?
      @as_of = ENV['CURRENT_DATE'].to_date
    end

    @member_statuses = ["active", "inactive"]

    @branches.each do |branch|

      puts "Processing #{branch.name}"

      @member_statuses.each do |member_status|
        @record = DataStore.personal_funds.where(
                "meta->>'branch_id' = ? AND CAST(meta->>'as_of' AS date) = ? AND meta->>'member_status' = ?",
                branch.id,
                @as_of,
                member_status
              ).first

        if @record.blank?
          @record = DataStore.create!(
                    meta: {
                      branch_id: branch.id,
                      branch_name: branch.name,
                      as_of: @as_of,
                      member_status: member_status,
                      data_store_type: @data_store_type,
                      progress: 0
                    },
                    data: {
                      status: "processing"
                    }
                  )

          args  = {
            id: @record.id,
            data_store_type: @data_store_type
          }

          ProcessInsurancePersonalFunds.perform_later(args)
        end
      end
      puts "Done!"
    end
  end

  task :insert_equity_value_to_life_transactions => :environment do
    puts "Inserting ..."

    if ENV['BRANCH_ID'].present?
      @branches = Branch.where(id: ENV['BRANCH_ID'])
    else
      @branches = Branch.all
    end

    member_account_ids = MemberAccount.where("account_type = ? AND account_subtype = ? AND status = ? AND branch_id IN (?)", "INSURANCE", "Life Insurance Fund", "active", @branches.ids).ids.uniq
    account_transactions = AccountTransaction.savings.where("amount > 0 AND subsidiary_id IN (?) AND status = ?", member_account_ids, "approved").order("updated_at DESC")

    size = account_transactions.count

    account_transactions.each_with_index do |at, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Insreting for transaction #{at.id}... #{progress}%%")

      at_data = at.data.with_indifferent_access
      ev_amount = at_data[:ending_balance].to_f / 2
      at_data[:equity_value] = ev_amount
      at.update!(data: at_data)
    end

    puts "\nDone!"
  end

  task :insert_equity_value_to_life_account => :environment do
    puts "Inserting ..."

    if ENV['BRANCH_ID'].present?
      @branches = Branch.where(id: ENV['BRANCH_ID'])
    else
      @branches = Branch.all
    end

    member_accounts = MemberAccount.where("account_type = ? AND account_subtype = ? AND status = ? AND branch_id IN (?)", "INSURANCE", "Life Insurance Fund", "active", @branches.ids)
    transactions = AccountTransaction.savings.where("subsidiary_id IN (?) AND status = ?", member_accounts.ids, "approved")

    size = member_accounts.count

    member_accounts.each_with_index do |ma, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Insreting for member account #{ma.id}... #{progress}%%")

      last_transaction = transactions.where("subsidiary_id = ?", ma.id).order("transacted_at ASC").last

      if !last_transaction.nil?
        latest_ev_amount = last_transaction.data.with_indifferent_access[:equity_value]
        if !ma.member_id.nil?
          if ma.data.nil?
            ma.data = { equity_value: latest_ev_amount }
            ma.save!
          else
            ma_data = ma.data.with_indifferent_access
            ma_data[:equity_value] = latest_ev_amount
            ma.update!(data: ma_data)
          end
        end
      end
    end

    puts "\nDone!"
  end

  task :insert_equity_value_to_life_account_from_balance => :environment do
    puts "Inserting ..."

    if ENV['BRANCH_ID'].present?
      @branches = Branch.where(id: ENV['BRANCH_ID'])
    else
      @branches = Branch.all
    end

    member_accounts = MemberAccount.where("account_type = ? AND account_subtype = ? AND status = ? AND branch_id IN (?)", "INSURANCE", "Life Insurance Fund", "active", @branches.ids)

    size = member_accounts.count

    member_accounts.each_with_index do |ma, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Insreting for member account #{ma.id}... #{progress}%%")

      balance = ma.balance.to_f

      if balance > 0
        if !ma.member_id.nil?
          if ma.data.nil?
            ma.data = { equity_value: balance / 2 }
            ma.save!
          else
            ma_data = ma.data.with_indifferent_access
            ma_data[:equity_value] = balance / 2
            ma.update!(data: ma_data)
          end
        end
      end
    end

    puts "\nDone!"
  end

  task :insert_equity_value_to_life_last_transaction => :environment do
    puts "Inserting ..."

    if ENV['BRANCH_ID'].present?
      @branches = Branch.where(id: ENV['BRANCH_ID'])
    else
      @branches = Branch.all
    end

    member_accounts = MemberAccount.where("account_type = ? AND account_subtype = ? AND status = ? AND branch_id IN (?)", "INSURANCE", "Life Insurance Fund", "active", @branches.ids)

    size = member_accounts.count

    member_accounts.each_with_index do |ma, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Insreting for member account #{ma.id}... #{progress}%%")

      last_transaction = AccountTransaction.savings.where("subsidiary_id IN (?) AND status = ?", ma.id, "approved").order("transacted_at ASC").last

      if !last_transaction.nil?
        at_data = last_transaction.data.with_indifferent_access
        ev_amount = at_data[:ending_balance].to_f / 2
        at_data[:equity_value] = ev_amount
        last_transaction.update!(data: at_data)
      end
    end

    puts "\nDone!"
  end

  task :update_ev_and_policy_loan_value_for_validation_record => :environment do
    puts "Updating ..."
    member_account_validations = MemberAccountValidation.all

    if ENV['BRANCH_ID'].present?
      member_account_validations = member_account_validations.where(branch_id: ENV['BRANCH_ID'])
    end

    member_account_validations.each do |member_account_validation|
      member_account_validation.member_account_validation_records.each do |member_account_validation_record|

        if member_account_validation_record.policy_loan.nil?
          member_account_validation_record.update!(policy_loan: 0.00)
        end

        if member_account_validation_record.equity_value.nil?
          member_account_validation_record.update!(equity_value: 0.00)
        end
      end
    end

    puts "Done"
  end

  task :repair_claims_accounting_entry => :environment do
    puts "Repairing ..."
    branch = Branch.where(id: Settings.try(:defaults).try(:default_branch).try(:id)).first
    claim = Claim.find(ENV['CLAIM_ID'])

    first_name = claim.prepared_by.split(" ").first
    last_name = claim.prepared_by.split(" ").last

    user = User.where(first_name: first_name, last_name: last_name).first

    if user.nil?
      user = User.find("42ae07d6-521f-4ea8-9d2e-7f48ab716116")
    end

    claim_data = claim.data.with_indifferent_access

    claim_data[:accounting_entry] = {}
    claim_data[:accounting_entry]  = ::Claims::BuildAccountingEntry.new(
                                config: {
                                  branch: branch,
                                  claim: claim,
                                  user: user
                                }
                              ).execute!

    claim.update!(data: claim_data)

    puts "Done"
  end

  task :insert_equity_value_interest => :environment do
    puts "Inserting ..."

    @start_date = nil
    @end_date = nil

    if ENV['START_DATE'].present?
      @start_date = ENV['START_DATE'].to_date
    end

    if ENV['END_DATE'].present?
      @end_date = ENV['END_DATE'].to_date
    end

    if ENV['BRANCH_ID'].present?
      @branches = Branch.where(id: ENV['BRANCH_ID'])
    else
      @branches = Branch.all
    end

    @branches.each do |branch|
      puts "Inserting for #{branch.name}"

      ::MemberAccounts::ComputeEvInterest.new(
                                  config: {
                                    branch: branch,
                                    start_date: @start_date,
                                    end_date: @end_date
                                  }
                            ).execute!

      puts "Done for #{branch.name}"
    end


    # member_accounts = MemberAccount.where("account_type = ? AND account_subtype = ? AND status = ? AND branch_id IN (?)", "INSURANCE", "Life Insurance Fund", "active", @branches.ids)

    # size = member_accounts.count

    # member_accounts.each_with_index do |member_account, i|
    #   progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
    #   printf("\r(#{i+1}/#{size}): Insreting for member account #{member_account.id}... #{progress}%%")

    #   ::MemberAccounts::ComputeEquityValueInterest.new(member_account: member_account, start_date: @start_date, end_date: @end_date).execute!
    # end

    puts "\nDone!"
  end

  task :delete_wrong_member_accounts => :environment do
    file_location = ENV['MEMBER_ACCOUNTS_CSV']
    puts file_location

    branch_names = []
    valid_member_accounts = []

    CSV.foreach(file_location, headers: true) do |row|
      puts "Processing #{row['uuid']} ..."
      branch_names <<  row['branch']
      valid_member_accounts << row['uuid']
    end

    branch = Branch.where("lower(name) = ?", branch_names.uniq.first.downcase).first
    to_delete_member_accounts = MemberAccount.where("branch_id = ? AND account_type = ? AND id NOT IN (?)", branch.id, "INSURANCE", valid_member_accounts)

    to_delete_member_accounts.destroy_all

    puts "Done!"
  end

  task :repair_members_center => :environment do
    if ENV['BRANCH_ID'].present?
      branches = Branch.where(id: ENV['BRANCH_ID'])
    else
      branches = Branch.all
    end

    branches.each do |branch|
      members = Member.where("branch_id = ?", branch.id)

      members.each do |member|
        puts "Member: #{member.id}"
        center = member.center
        c_name = center.name.upcase

        if center.branch_id != branch.id
          puts "Repairing"

          c = Center.where("upper(name) = ? AND branch_id = ?", c_name, branch.id).first

          if c.nil?
            n_center = Center.new
            n_center.name = c_name
            n_center.short_name = c_name
            n_center.meeting_day = 1
            n_center.user = User.find("42ae07d6-521f-4ea8-9d2e-7f48ab716116")
            n_center.branch = branch
            n_center.save!

            member.update!(center: n_center)
          else
            member.update!(center: c)
          end
        end
      end
    end

    puts "Done!"
  end

  task :delete_member_by_uuid => :environment do
    file_location = ENV['FILE_CSV']
    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      member = Member.where(id: row['uuid']).first

      if member.present?
        puts "Deleting #{row['uuid']}..."
        puts "#{member.full_name}"
        member.destroy!
      end
    end

    puts "Done!"
  end

  task :delete_member_by_identification_number => :environment do
    file_location = ENV['FILE_CSV']
    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      member = Member.where(identification_number: row['identification_number']).first

      if member.present?
        puts "Deleting #{member.full_name} ..."
        member_accounts = member.member_accounts

        member_accounts.each do |ma|
          ma.account_transactions.destroy_all
          ma.destroy!
          puts "Done deleting member accounts and account transactions ..."
        end

        member.destroy!
      end
    end

    puts "Done!"
  end

  task :insert_insurance_interest_beginning_balance => :environment do
    # HEADER: identification_number, rf_interest, ev_interest

    file_location = ENV['INTEREST_CSV']

    if ENV['CURRENT_DATE'].present?
      current_date = ENV['CURRENT_DATE'].to_date
    else
      current_date = Date.today
    end

    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      member = Member.where(identification_number: row['identification_number']).first

      if !member.nil?
        if member.insurance_active?
          rf_account = member.member_accounts.where(account_subtype:"Retirement Fund").first
          ev_account = member.member_accounts.where(account_subtype:"Equity Value").first

          if ev_account.present?
            puts "Inseting EV Interest for #{member.full_name} - #{member.id}"

            ev_balance  = ev_account.balance.to_f
            ev_interest = row['ev_interest'].to_f
            ev_new_balance = ev_interest + ev_balance

            ev_account_transaction  = AccountTransaction.new(
                                      subsidiary_id: ev_account.id,
                                      subsidiary_type: "MemberAccount",
                                      amount: ev_interest,
                                      transaction_type: "deposit",
                                      transacted_at: current_date,
                                      status: "approved",
                                      data: {
                                        is_withdraw_payment: false,
                                        is_fund_transfer: false,
                                        is_interest: true,
                                        is_adjustment: false,
                                        is_for_exit_age: false,
                                        is_for_loan_payments: false,
                                        accounting_entry_reference_number: nil,
                                        beginning_balance: ev_balance,
                                        ending_balance: ev_new_balance
                                      }
                                    )

            ev_account_transaction.save!

            ev_account.update!(balance: ev_new_balance)
          end

          if rf_account.present?
            puts "Inseting RF Interest for #{member.full_name} - #{member.id}"

            rf_balance     = rf_account.balance.to_f
            rf_interest    = row['rf_interest'].to_f
            rf_new_balance = rf_interest + rf_balance

            rf_account_transaction  = AccountTransaction.new(
                                      subsidiary_id: rf_account.id,
                                      subsidiary_type: "MemberAccount",
                                      amount: rf_interest,
                                      transaction_type: "deposit",
                                      transacted_at: current_date,
                                      status: "approved",
                                      data: {
                                        is_withdraw_payment: false,
                                        is_fund_transfer: false,
                                        is_interest: true,
                                        is_adjustment: false,
                                        is_for_exit_age: false,
                                        is_for_loan_payments: false,
                                        accounting_entry_reference_number: nil,
                                        beginning_balance: rf_balance,
                                        ending_balance: rf_new_balance
                                      }
                                    )

            rf_account_transaction.save!

            rf_account.update!(balance: rf_new_balance)
          end
        end
      end
    end

    puts "\nDone."
  end

  task :delete_wrong_insurance_interest => :environment do
    puts "Deleting wrong interest ..."

    members = Member.where(insurance_status: "resigned")

    members.each do |member|
      puts "Deleting interest for #{member.full_name}"

      rf_account = member.member_accounts.where(account_subtype:"Retirement Fund").first
      ev_account = member.member_accounts.where(account_subtype:"Equity Value").first

      if ev_account.present?
        if ev_account.balance > 0.0
          ev_interest_transactions = ev_account.account_transactions.where("data->>'is_interest' = ?", "true")
          ev_interest_transactions.destroy_all

          ::MemberAccounts::Rehash.new(member_account: ev_account, account_transactions: nil).execute!

          if ev_account.balance < 0.0
            at = ev_account.account_transactions.order("transacted_at ASC").last

            at_data = at.data.with_indifferent_access
            beginning_balance = at_data[:beginning_balance].to_f
            at.update!(amount: beginning_balance)

            ::MemberAccounts::Rehash.new(member_account: ev_account, account_transactions: nil).execute!
          end
        end
      end

      if rf_account.present?
        if rf_account.balance > 0.0
          rf_interest_transactions = rf_account.account_transactions.where("data->>'is_interest' = ?", "true")
          rf_interest_transactions.destroy_all

          ::MemberAccounts::Rehash.new(member_account: rf_account, account_transactions: nil).execute!

          if rf_account.balance < 0.0
            at = rf_account.account_transactions.order("transacted_at ASC").last

            at_data = at.data.with_indifferent_access
            beginning_balance = at_data[:beginning_balance].to_f
            at.update!(amount: beginning_balance)

            ::MemberAccounts::Rehash.new(member_account: rf_account, account_transactions: nil).execute!
          end
        end
      end
    end

    puts "\nDone."
  end

  task :delete_insurance_interest => :environment do
    puts "Deleting wrong interest ..."

    file_location = ENV['FILE']

    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      member = Member.where(identification_number: row['identification_number']).first

      if !member.nil?
        puts "Deleting interest for #{member.full_name}"

        rf_account = member.member_accounts.where(account_subtype:"Retirement Fund").first
        ev_account = member.member_accounts.where(account_subtype:"Equity Value").first

        if ev_account.present?
          if ev_account.balance > 0.0
            ev_interest_transactions = ev_account.account_transactions.where("data->>'is_interest' = ? AND transacted_at >= ?", "true", "2021-10-22".to_date)
            ev_interest_transactions.destroy_all

            ::MemberAccounts::Rehash.new(member_account: ev_account, account_transactions: nil).execute!
          end
        end

        if rf_account.present?
          if rf_account.balance > 0.0
            rf_interest_transactions = rf_account.account_transactions.where("data->>'is_interest' = ? AND transacted_at >= ?", "true", "2021-10-22".to_date)
            rf_interest_transactions.destroy_all

            ::MemberAccounts::Rehash.new(member_account: rf_account, account_transactions: nil).execute!
          end
        end
      end
    end

    puts "\nDone."
  end

  task :delete_wrong_ev_and_rf_interest => :environment do
    puts "Deleting wrong interest ..."

    file_location = ENV['FILE']

    puts file_location

    CSV.foreach(file_location, headers: true) do |row|
      member = Member.where(identification_number: row['identification_number']).first

      if !member.nil?
        puts "Deleting interest for #{member.full_name}"

        rf_account = member.member_accounts.where(account_subtype:"Retirement Fund").first
        ev_account = member.member_accounts.where(account_subtype:"Equity Value").first

        if ev_account.present?
          ev_interest_transaction = ev_account.account_transactions.where("data->>'is_interest' = ? AND transacted_at >= ? AND transacted_at <= ?", "true", "2021-09-15".to_date, "2021-09-16".to_date).first
          ev_trans_data = ev_interest_transaction.data.with_indifferent_access
          ev_interest_transaction_beg_balance = ev_trans_data[:beginning_balance].to_f
          ev_interest_transaction.destroy!
          last_ev_trans = ev_account.account_transactions.order("transacted_at ASC").last
          last_ev_trans.update!(amount: ev_interest_transaction_beg_balance)

          ::MemberAccounts::Rehash.new(member_account: ev_account, account_transactions: nil).execute!
        end

        if rf_account.present?
          rf_interest_transaction = rf_account.account_transactions.where("data->>'is_interest' = ? AND transacted_at >= ? AND transacted_at <= ?", "true", "2021-09-15".to_date, "2021-09-16".to_date).first
          rf_interest_transaction.destroy!
          ::MemberAccounts::Rehash.new(member_account: rf_account, account_transactions: nil).execute!

          rrf_interest_transaction = rf_account.account_transactions.where("data->>'is_interest' = ? AND transacted_at >= ?", "true", "2021-09-17".to_date).first
          rrf_trans_data = rrf_interest_transaction.data.with_indifferent_access
          rrf_interest_transaction_end_balance = rrf_trans_data[:ending_balance].to_f
          last_rf_trans = rf_account.account_transactions.where("data->>'is_interest' = ?", "false").order("transacted_at ASC").last
          last_rf_trans.update!(amount: rrf_interest_transaction_end_balance)
          ::MemberAccounts::Rehash.new(member_account: rf_account, account_transactions: nil).execute!
        end
      end
    end

    puts "\nDone."
  end

  task :rehash_ev_and_rf_member_accounts => :environment do
    puts "Rehashing ..."

    if ENV['BRANCH_ID'].present?
      @rf_accounts = MemberAccount.where(account_subtype: "Retirement Fund", branch_id: ENV['BRANCH_ID'])
      @ev_accounts = MemberAccount.where(account_subtype: "Equity Value", branch_id: ENV['BRANCH_ID'])
    else
      @rf_accounts = MemberAccount.where(account_subtype: "Retirement Fund")
      @ev_accounts = MemberAccount.where(account_subtype: "Equity value")
    end

    if !@rf_accounts.nil?
      puts "Rehashing RF accounts ..."
      @rf_accounts.each do |rf_account|
        puts "#{rf_account.id} ..."
        ::MemberAccounts::Rehash.new(member_account: rf_account, account_transactions: nil).execute!
      end
    end
    puts "Done rf accounts!\n\n"

    if !@ev_accounts.nil?
      puts "Rehashing EV accounts ..."
      @ev_accounts.each do |ev_account|
        puts "#{ev_account.id} ..."

        ::MemberAccounts::Rehash.new(member_account: ev_account, account_transactions: nil).execute!
      end

      puts "Done ev accounts!\n"
    end

    puts "\nDone."
  end

  task :member_is_reclassified_adjust => :environment do
    puts "Checking All Member ..."
    # csv_format_header (identification_number,associate_identification_number)

    file_location = ENV['MEMBERS_CSV']
    puts file_location
    # raise file_location.inspect

    CSV.foreach(file_location, headers: true) do |row|
      member_identification_number = row['identification_number']
      is_reclassified = row['is_reclassified']

      member = Member.where(identification_number: member_identification_number)
      # raise member.inspect
      member.map { |m|
        @member_id = m[:id]
      }

      member_id = Member.find(@member_id)

      if member_id.present?
        puts "Updating Reclassified Member: #{member_identification_number}"
        member_data = member_id.data.with_indifferent_access
        member_data[:is_reclassified] = is_reclassified
        member.update!(data: member_data)
      else
        puts "Id Number not Found"
      end
    end

    puts "Done!"
  end

  task :add_gender => :environment do
    @members  = []
    @dependets = []
    legal_dependent = LegalDependent.all

    legal_dependent.each do |m|
      data = {}
      data[:id] = m.id
      data[:first_name] = m.first_name
      data[:member_id] = m.member_id

      @members << data
    end

    # raise @members.inspect
    @dependets = @members.map{ |y|
      {
        id: y[:id],
        last_letter: y[:first_name][-1],
        member_id: y[:member_id]
      }
    }

    @dependets.each do |dependent|
      if dependent[:member_id].present?
        if ["A", "E", "I", "O", "U"].include?(dependent[:last_letter].upcase)
          puts "Updating Dependent ID: #{dependent[:id]}"
          a = LegalDependent.find("#{dependent[:id]}").update!(gender: "Female")
        else
          puts "Updating Dependent ID: #{dependent[:id]}"
          a = LegalDependent.find("#{dependent[:id]}").update!(gender: "Male")
        end
      end
    end
  end

  task :fix_wrong_in_account_transaction => :environment do
    branch_id = ENV["BRANCH_ID"]
    members_resigned = Member.where("branch_id = ? and date_resigned >= ? and date_resigned <= ?","#{branch_id}","2023-10-27","2023-10-31")
    members_resigned.each do |mr|
      loans = Loan.where("status = ? and date_completed >= ? and date_completed <= ? and member_id = ?","paid", "2023-10-27","2023-10-31","#{mr.id}")

      loans.each do |l|
        ll= Loan.find(l.id)
        puts " FIX loan - #{ll.id}"
        last_account_transaction = AccountTransaction.where(subsidiary_id: "#{ll.id}", status: "approved").order("transacted_at DESC").first
        account_transaction = AccountTransaction.find(last_account_transaction.id)
        a_data = account_transaction.data.with_indifferent_access
        if a_data["total_interest_balance"].present?
          interest_amount = a_data["total_interest_balance"]
          a_data.delete("total_interest_balance")
          a_data["total_interest_paid"] = interest_amount
        end

        if a_data["total_principal_balance"].present?
          principal_amount = a_data["total_principal_balance"]
          a_data.delete("total_principal_balance")
          a_data["total_principal_paid"] = principal_amount
        end
        account_transaction.update!(data: a_data)
      end

    end
    puts "done"
  end

  task :process_kok_loan => :environment do
    kok = InsuranceLoanBundleEnrollment.all

    kok.each do |k|
      status = k.status
      if status == "approved" || status == "for-renewal" || status == "on-grace-period"
        kok_data = k.data.with_indifferent_access[:records]
        kok_last_data = kok_data.last

        insurance_loan_bundle_enrollment      = InsuranceLoanBundleEnrollment.where(id: k[:id]).first
        plan_type                             = kok_last_data[:kok_data][:plan_type]
        plan_category                         = kok_last_data[:kok_data][:plan_type],
        partner                               = kok_last_data[:kok_data][:partner],
        policy_no                             = kok_last_data[:kok_data][:policy_no],
        effectivity_date                      = kok_last_data[:kok_data][:effectivity_date],
        maturity_date                         = kok_last_data[:kok_data][:maturity_date],
        client_type                           = kok_last_data[:kok_data][:client_type],
        first_name                            = kok_last_data[:kok_data][:client_type],
        middle_name                           = kok_last_data[:kok_data][:client_type],
        last_name                             = kok_last_data[:kok_data][:client_type],
        address                               = kok_last_data[:kok_data][:address],
        gender                                = kok_last_data[:kok_data][:gender],
        enrolled_status                       = kok_last_data[:kok_data][:enrolled_status],
        civil_status                          = kok_last_data[:kok_data][:civil_status],
        birth_date                            = kok_last_data[:kok_data][:birth_date],
        age                                   = kok_last_data[:kok_data][:age].to_i,
        premium_coverage                      = kok_last_data[:kok_data][:premium_coverage],
        mobile_no                             = kok_last_data[:kok_data][:mobile_no],
        membership_date                       = kok_last_data[:kok_data][:membership_date],
        benif_fname                           = kok_last_data[:kok_data][:benif_fname],
        benif_mname                           = kok_last_data[:kok_data][:benif_mname],
        benif_lname                           = kok_last_data[:kok_data][:benif_lname],
        benif_birth_date                      = kok_last_data[:kok_data][:benif_birth_date],
        benif_gender                          = kok_last_data[:kok_data][:benif_gender],
        benif_relationship                    = kok_last_data[:kok_data][:benif_relationship],
        member                                = Member.where(id: kok_last_data[:member][:id]).first
        kok_id                                = k[:id]
        maturity_date                         = kok_last_data[:kok_data][:maturity_date].to_date
        four_weeks_ago                        = (maturity_date - 28)
        on_grace_period                       = (maturity_date + 30)
        status                                = k[:status]
        now                                   = Date.today

        config = {
          insurance_loan_bundle_enrollment: insurance_loan_bundle_enrollment,
          plan_type: plan_type,
          plan_category: plan_category,
          partner: partner,
          policy_no: policy_no,
          effectivity_date: effectivity_date,
          maturity_daste: maturity_date,
          client_type: client_type,
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          address: address,
          gender: gender,
          enrolled_status: enrolled_status,
          civil_status: civil_status,
          birth_date: birth_date,
          age: age,
          premium_coverage: premium_coverage,
          mobile_no: mobile_no,
          membership_date: membership_date,
          benif_fname: benif_fname,
          benif_mname: benif_mname,
          benif_lname: benif_lname,
          benif_birth_date: benif_birth_date,
          benif_gender: benif_gender,
          benif_relationship: benif_relationship,
          member: member,
          kok_id: kok_id,
          maturity_date: maturity_date,
          four_weeks_ago: four_weeks_ago,
          on_grace_period: on_grace_period,
          now: now,
          status: status
        }

        ProcessKokLoan.perform_later(config)
      end
    end
  end

  task :process_kok_loan_lapsed => :environment do
    kok = InsuranceLoanBundleEnrollment.lapsed

    kok.each do |k|
      status = k.status
      if status == "lapsed"
        kok_data = k.data.with_indifferent_access[:records]
        kok_last_data = kok_data.last

        insurance_loan_bundle_enrollment      = InsuranceLoanBundleEnrollment.where(id: k[:id]).first
        plan_type                             = kok_last_data[:kok_data][:plan_type]
        plan_category                         = kok_last_data[:kok_data][:plan_type],
        partner                               = kok_last_data[:kok_data][:partner],
        policy_no                             = kok_last_data[:kok_data][:policy_no],
        effectivity_date                      = kok_last_data[:kok_data][:effectivity_date],
        maturity_date                         = kok_last_data[:kok_data][:maturity_date],
        client_type                           = kok_last_data[:kok_data][:client_type],
        first_name                            = kok_last_data[:kok_data][:client_type],
        middle_name                           = kok_last_data[:kok_data][:client_type],
        last_name                             = kok_last_data[:kok_data][:client_type],
        address                               = kok_last_data[:kok_data][:address],
        gender                                = kok_last_data[:kok_data][:gender],
        enrolled_status                       = kok_last_data[:kok_data][:enrolled_status],
        civil_status                          = kok_last_data[:kok_data][:civil_status],
        birth_date                            = kok_last_data[:kok_data][:birth_date],
        age                                   = kok_last_data[:kok_data][:age].to_i,
        premium_coverage                      = kok_last_data[:kok_data][:premium_coverage],
        mobile_no                             = kok_last_data[:kok_data][:mobile_no],
        membership_date                       = kok_last_data[:kok_data][:membership_date],
        benif_fname                           = kok_last_data[:kok_data][:benif_fname],
        benif_mname                           = kok_last_data[:kok_data][:benif_mname],
        benif_lname                           = kok_last_data[:kok_data][:benif_lname],
        benif_birth_date                      = kok_last_data[:kok_data][:benif_birth_date],
        benif_gender                          = kok_last_data[:kok_data][:benif_gender],
        benif_relationship                    = kok_last_data[:kok_data][:benif_relationship],
        member                                = Member.where(id: kok_last_data[:member][:id]).first
        kok_id                                = k[:id]
        maturity_date                         = kok_last_data[:kok_data][:maturity_date].to_date
        four_weeks_ago                        = (maturity_date - 28)
        on_grace_period                       = (maturity_date + 90)
        status                                = k[:status]
        now                                   = Date.today

        config = {
          insurance_loan_bundle_enrollment: insurance_loan_bundle_enrollment,
          plan_type: plan_type,
          plan_category: plan_category,
          partner: partner,
          policy_no: policy_no,
          effectivity_date: effectivity_date,
          maturity_daste: maturity_date,
          client_type: client_type,
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          address: address,
          gender: gender,
          enrolled_status: enrolled_status,
          civil_status: civil_status,
          birth_date: birth_date,
          age: age,
          premium_coverage: premium_coverage,
          mobile_no: mobile_no,
          membership_date: membership_date,
          benif_fname: benif_fname,
          benif_mname: benif_mname,
          benif_lname: benif_lname,
          benif_birth_date: benif_birth_date,
          benif_gender: benif_gender,
          benif_relationship: benif_relationship,
          member: member,
          kok_id: kok_id,
          maturity_date: maturity_date,
          four_weeks_ago: four_weeks_ago,
          on_grace_period: on_grace_period,
          now: now,
          status: status
        }

        ProcessKokLoanLapsed.perform_later(config)
      end
    end
  end

end
