namespace :db do
  task :clear_schema_migrations => :environment do
    current_version = ENV['VERSION'].to_i
    puts "Current migration version: #{current_version}"

    valid_migrations = []

    ActiveRecord::SchemaMigration.all.pluck(:version).each do |version|
      if version.to_i < current_version
        valid_migrations << version.to_s
      end
    end

    puts "Deleting all schema_migrations...."
    ActiveRecord::SchemaMigration.delete_all

    valid_migrations.each do |version|
      puts "Creating schema_migration for #{version}"
      ActiveRecord::SchemaMigration.create!(version: version)
    end

    puts "Done."
  end

  task :backup => :environment do
    filename = "#{Time.now.to_i}-backup-#{ENV['RAILS_ENV'] ||= 'development'}.dump"

    ::Utils::BackupDatabase.new(
      config: {
        destination_file: "#{Rails.root}/db_backup/#{filename}"
      }
    ).execute!
  end
  
  task :fetch_uninterested_members => :environment do
    monthly_closing_collection  = MonthlyClosingCollection.find(ENV['ID'])
    branch                      = monthly_closing_collection.branch
    closing_date                = monthly_closing_collection.closing_date
    data                        = monthly_closing_collection.data.with_indifferent_access

    puts "Members without interest for monthly closing dated #{closing_date}. ID: #{monthly_closing_collection.id}"

    active_members  = Member.active.where(branch_id: branch.id)
    member_ids      = []

    data[:records].each do |r|
      member_ids << r[:member][:id]
    end

    uninterested_members  = active_members.where.not(id: member_ids).order("last_name ASC")

    uninterested_members.each_with_index do |m, i|
      puts "#{i + 1},#{m.id},#{m.last_name},#{m.last_name}"
    end
  end

  task :update_nil_date_released => :environment do
    loans = Loan.active_or_paid.where(date_released: nil)
    size  = loans.size

    puts "Updating #{size} loans with no date_released..."

    loans.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Examining #{o.id}... #{progress}%%")

      branch                = o.branch
      accounting_entry_data = o.data.with_indifferent_access[:accounting_entry]

      date_released = AccountingEntry.where(
                        reference_number: accounting_entry_data[:reference_number],
                        book: accounting_entry_data[:book],
                        branch_id: branch.id
                      ).first.date_posted

      o.update!(date_released: date_released)
    end

    puts ""
    puts "Done!"
  end

  task :check_loan_payments => :environment do
    as_of         = ENV['AS_OF'].try(:to_date) || Date.today
    branch        = Branch.find(ENV['BRANCH_ID'])
    loan_product  = LoanProduct.find(ENV['LOAN_PRODUCT_ID'])

    puts "Loan Product: #{loan_product.to_s}"

    invalid_loans = []

    loans = Loan.active_or_paid.where(branch_id: branch.id, loan_product_id: loan_product.id)

    size  = loans.size

    total_portfolio = 0.00
    loans.each_with_index do |o,i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Examining #{o.id}... #{progress}%%")
      #sleep(0.1)

      amorts  = AmortizationScheduleEntry.where(
                  "due_date <= ? AND loan_id = ?",
                  as_of,
                  o.id
                ).order("due_date ASC")

      payments  = AccountTransaction.approved_loan_payments.where(
                    "DATE(transacted_at) <= ? AND subsidiary_id = ? AND subsidiary_type = ?",
                    as_of,
                    o.id,
                    "Loan"
                  )

      portfolio = o.amortization_schedule_entries.sum(:principal) - payments.sum("CAST(data->>'total_principal_paid' AS decimal)")
      total_portfolio += portfolio

      if o.amortization_schedule_entries.sum(:principal).to_f.round(2) != o.principal.to_f.round(2)
        puts ""
        puts "Found invalid loan: #{o.id}"
        invalid_loans << o.id
      end
      
    end
    puts ""
    puts "Total portfolio: #{total_portfolio}"

    if invalid_loans.any?
      puts "Found #{invalid_loans.size} invalid loans."
    end

    puts ""
    puts "Done."
  end

  task :correct_member_accounts => :environment do
    from_account_type     = ENV['FROM_ACCOUNT_TYPE']
    from_account_subtype  = ENV['FROM_ACCOUNT_SUBTYPE']

    to_account_type     = ENV['TO_ACCOUNT_TYPE']
    to_account_subtype  = ENV['TO_ACCOUNT_SUBTYPE']

    member_accounts = MemberAccount.where(
                        account_type: from_account_type,
                        account_subtype: from_account_subtype
                      )

    size  = member_accounts.size

    member_accounts.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Correcting member account #{o.id}... #{progress}%%")
      sleep(0.1)

      o.update!(account_type: to_account_type, account_subtype: to_account_subtype)
    end

    puts ""
    puts "Done."
  end

  task :delete_branch => :environment do
    branch  = Branch.where(id: ENV['BRANCH_ID']).first

    if branch.present?
      member_ids            = Member.where(branch_id: branch.id).pluck(:id)
      loan_ids              = Loan.where(member_id: member_ids).pluck(:id)
      member_account_ids    = MemberAccount.where(member_id: member_ids).pluck(:id)
      accounting_entry_ids  = AccountingEntry.where(branch_id: branch.id).pluck(:id)
      center_ids            = Center.where(branch_id: branch.id)

      # Delete account_transactions
      puts "Deleting account_transactions for member_accounts..."
      AccountTransaction.where(subsidiary_id: member_account_ids).delete_all
      puts "Deleting account_transactions for loans..."
      AccountTransaction.where(subsidiary_id: loan_ids).delete_all

      # Delete journal_entries
      puts "Deleting journal_entries..."
      JournalEntry.where(accounting_entry_id: accounting_entry_ids).delete_all

      # Delete accounting_entries
      puts "Deleting accounting_entries..."
      AccountingEntry.where(id: accounting_entry_ids).delete_all

      # Delete amortization_schedule_entries
      puts "Deleting amortization_schedule_entries..."
      AmortizationScheduleEntry.where(loan_id: loan_ids).delete_all

      # Delete loans
      puts "Deleting loans..."
      Loan.where(id: loan_ids).delete_all

      # Delete legal_dependents
      puts "Deleting legal_dependents..."
      LegalDependent.where(member_id: member_ids).delete_all

      # Delete beneficiaries
      puts "Deleting beneficiaries..."
      Beneficiary.where(member_id: member_ids).delete_all

      # Delete billings
      puts "Deleting billings..."
      Billing.where(branch_id: branch.id).delete_all

      # Delete member_shares
      puts "Deleting member_shares..."
      MemberShare.where(member_id: member_ids).delete_all

      # Delete member_accounts
      puts "Deleting member_accounts..."
      MemberAccount.where(id: member_account_ids).delete_all
      MemberAccount.where(center_id: center_ids).delete_all

      # Delete membership_payment_records
      puts "Deleting membership_payment_records..."
      MembershipPaymentRecord.where(member_id: member_ids).delete_all

      # Delete membership_payment_collections
      puts "Deleting membership_payment_collections..."
      MembershipPaymentCollection.where(branch_id: branch.id).delete_all

      # Delete monthly_closing_collections
      puts "Deleting monthly_closing_collections..."
      MonthlyClosingCollection.where(branch_id: branch.id).delete_all

      # Delete deposit_collections
      puts "Deleting deposit_collections..."
      DepositCollection.where(branch_id: branch.id).delete_all

      # Delete withdrawal_collections
      puts "Deleting withdrawal_collections..."
      WithdrawalCollection.where(branch_id: branch.id).delete_all

      # Delete members
      puts "Deleting members..."
      Member.where(branch_id: branch.id).delete_all

      # Delete user_branches
      puts "Deleting user_branches..."
      UserBranch.where(branch_id: branch.id).delete_all

      # Delete data_stores
      puts "Deleting data_stores..."
      DataStore.where("meta->>'branch_id' = ?", branch.id).delete_all

      # Delete branch
      #branch.destroy!

    else
      puts "Branch with id #{ENV['BRANCH_ID']} not found!"
    end

    puts "Done!"
  end

  desc "Restore database"
  task :restore => :environment do
    puts "Restoring database..."

    if ::ActiveRecord::Base.connection_db_config.configuration_hash[:adapter] == 'postgresql'
      cmd = nil
      with_config do |app, host, db, user, pw|
        cmd = "PGPASSWORD=#{pw} pg_restore --verbose --host #{host} --username #{user} --clean --no-owner --no-acl --dbname #{db} #{ENV['PG_BACKUP_DUMP']}"
      end
      Rake::Task["db:drop"].invoke
      Rake::Task["db:create"].invoke
      puts cmd
      exec cmd
    else
      puts "Invalid database adapter"
    end
  end

  task :save_accounting_codes => :environment do
    accounting_codes  = AccountingCode.all
    filename          = "accounting-codes-v2.json"
    full_path         = "#{Rails.root}/db_backup/#{filename}"

    data = { 
      accounting_codes: []
    }   

    accounting_codes.each do |o| 
      data[:accounting_codes] << o.to_version_2_hash
    end 

    puts "Saving file to #{full_path}..."

    File.write(full_path, JSON.pretty_generate(data))

    puts "Done!"
  end

  private

  def with_config
    yield Rails.application.class.name.partition('::').first,
      ActiveRecord::Base.connection_db_config.configuration_hash[:host],
      ActiveRecord::Base.connection_db_config.configuration_hash[:database],
      ActiveRecord::Base.connection_db_config.configuration_hash[:username],
      ActiveRecord::Base.connection_db_config.configuration_hash[:password]
  end

  task :save_blip => :environment do
    if ENV['BRANCH_ID'].present?
      branch = Branch.find(ENV['BRANCH_ID'])
      claims = Claim.where(branch_id: branch.id)
      filename  = "#{branch}-blip-v2.json" 
    else
      claims   = Claim.all
      filename  = "blip-v2.json"
    end

    full_path = "#{Rails.root}/db_backup/#{filename}"

    data  = {
      claim: []
    }

    claims.each do |o|
      data[:claim] << o.blip_hash
    end

    puts "Saving file to #{full_path}..."

    File.write(full_path, JSON.pretty_generate(data))

    puts "Done!"
  end

  task :save_clip => :environment do
    if ENV['BRANCH_ID'].present?
      branch = Branch.find(ENV['BRANCH_ID'])
      clip_claims = ClipClaim.where(branch_id: branch.id)
      filename  = "#{branch}-clip-v2.json" 
    else
      clip_claims   = ClipClaim.all
      filename  = "clip-v2.json"
    end

    full_path = "#{Rails.root}/db_backup/#{filename}"

    data  = {
      claim: []
    }

    clip_claims.each do |o|
      data[:claim] << o.clip_hash
    end

    puts "Saving file to #{full_path}..."

    File.write(full_path, JSON.pretty_generate(data))

    puts "Done!"
  end

  task :save_hiip => :environment do
    if ENV['BRANCH_ID'].present?
      branch = Branch.find(ENV['BRANCH_ID'])
      hiip_claims = HiipClaim.where(branch_id: branch.id)
      filename  = "#{branch}-hiip-v2.json" 
    else
      hiip_claims   = HiipClaim.all
      filename  = "hiip-v2.json"
    end

    full_path = "#{Rails.root}/db_backup/#{filename}"

    data  = {
      claim: []
    }

    hiip_claims.each do |o|
      data[:claim] << o.hiip_hash
    end

    puts "Saving file to #{full_path}..."

    File.write(full_path, JSON.pretty_generate(data))

    puts "Done!"
  end

  task :save_calamity => :environment do
    if ENV['BRANCH_ID'].present?
      branch = Branch.find(ENV['BRANCH_ID'])
      calamity_claims = CalamityClaim.where(branch_id: branch.id)
      filename  = "#{branch}-calamity-v2.json" 
    else
      calamity_claims   = CalamityClaim.all
      filename  = "calamity-v2.json"
    end

    full_path = "#{Rails.root}/db_backup/#{filename}"

    data  = {
      claim: []
    }

    calamity_claims.each do |o|
      data[:claim] << o.calamity_hash
    end

    puts "Saving file to #{full_path}..."

    File.write(full_path, JSON.pretty_generate(data))

    puts "Done!"
  end

  task :save_scholarship => :environment do
    if ENV['BRANCH_ID'].present?
      branch = Branch.find(ENV['BRANCH_ID'])
      scholarships = KjspClaim.where(branch_id: branch.id)
      filename  = "#{branch}-scholarship-v2.json" 
    else
      scholarships   = KjspClaim.all
      filename  = "scholarship-v2.json"
    end

    full_path = "#{Rails.root}/db_backup/#{filename}"

    data  = {
      claim: []
    }

    scholarships.each do |o|
      data[:claim] << o.scholarship_hash
    end

    puts "Saving file to #{full_path}..."

    File.write(full_path, JSON.pretty_generate(data))

    puts "Done!"
  end

  task :save_kbente => :environment do
    if ENV['BRANCH_ID'].present?
      branch = Branch.find(ENV['BRANCH_ID'])
      kbente = KbenteClaim.where(branch_id: branch.id)
      filename  = "#{branch}-kbente-v2.json" 
    else
      kbente   = KbenteClaim.all
      filename  = "kbente-v2.json"
    end

    full_path = "#{Rails.root}/db_backup/#{filename}"

    data  = {
      claim: []
    }

    kbente.each do |o|
      data[:claim] << o.kbente_hash
    end

    puts "Saving file to #{full_path}..."

    File.write(full_path, JSON.pretty_generate(data))

    puts "Done!"
  end

  task :save_kalinga => :environment do
    if ENV['BRANCH_ID'].present?
      branch = Branch.find(ENV['BRANCH_ID'])
      kalinga = KalingaClaim.where(branch_id: branch.id)
      filename  = "#{branch}-kalinga-v2.json" 
    else
      kalinga   = KalingaClaim.all
      filename  = "kalinga-v2.json"
    end

    full_path = "#{Rails.root}/db_backup/#{filename}"

    data  = {
      claim: []
    }

    kalinga.each do |o|
      data[:claim] << o.kalinga_hash
    end

    puts "Saving file to #{full_path}..."

    File.write(full_path, JSON.pretty_generate(data))

    puts "Done!"
  end

  task :save_kalingaclaims => :environment do
    if ENV['BRANCH_ID'].present?
      branch = Branch.find(ENV['BRANCH_ID'])
      kalinga = KalingaClaim.where(branch_id: branch.id)
      filename  = "#{branch}-kalinga-v2.json" 
    else
      kalinga   = KalingaClaim.all
      filename  = "kalinga-v2.json"
    end

    full_path = "#{Rails.root}/db_backup/#{filename}"

    data  = {
      claim: []
    }

    kalinga.each do |o|
      data[:claim] << o.kalinga
    end

    puts "Saving file to #{full_path}..."

    File.write(full_path, JSON.pretty_generate(data))

    puts "Done!"
  end
end
