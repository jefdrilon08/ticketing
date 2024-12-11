namespace :monitor do
  task :check_balances => :environment do
    branch          = Branch.find(ENV['BRANCH_ID'])
    account_type    = ENV['ACCOUNT_TYPE']
    account_subtype = ENV['ACCOUNT_SUBTYPE']

    puts "Branch: #{branch.name}"
    puts "Account Type: #{account_type}"
    puts "Account Subtype: #{account_subtype}"
    puts "====================================="
    
    member_accounts = MemberAccount.where(
                        account_type: account_type,
                        account_subtype: account_subtype,
                        branch_id: branch.id
                      )

    member_accounts.each do |o|
      result  = ::MemberAccounts::CheckBalance.new(
                  config: {
                    member_account: o
                  }
                ).execute!

      if result[:running_balance].to_f != result[:ending_balance]
        puts "Invalid: #{o.id} Running Balance: #{result[:running_balance]} Ending Balance: #{result[:ending_balance]} Member: #{o.member.full_name} Status: #{o.member.status}"
      end
    end
  end

  task :floating_member_accounts_summary => :environment do
    member_accounts   = MemberAccount.where(member_id: nil)
    account_types     = member_accounts.pluck(:account_type).uniq
    account_subtypes  = member_accounts.pluck(:account_subtype).uniq
    branches          = Branch.where(id: member_accounts.pluck(:branch_id).uniq)

    branches.each do |branch|
      branch_member_accounts  = member_accounts.where(branch_id: branch.id, account_type: account_types, account_subtype: account_subtypes)

      if branch_member_accounts.any?
        puts "Branch: #{branch.name}"
        invalid_account_subtypes  = branch_member_accounts.pluck(:account_subtype).uniq

        invalid_account_subtypes.each do |o|
          accts = branch_member_accounts.where(account_subtype: o)
          puts "Account Type: #{accts.first.account_type} Account Subtype: #{o} Count: #{accts.size}"
        end
      end

      puts ""
    end
  end

  task :missing_member_accounts => :environment do
    members = Member.all.order("last_name ASC")

    if ENV['BRANCH_ID'].present?
      branch  = Branch.find(ENV['BRANCH_ID'])
      members = memers.where(branch_id: branch.id)
    end

    if ENV['CENTER_ID'].present?
      center  = Center.find(ENV['CENTER_ID'])
      members = members.where(center_id: center.id)
    end

    puts "Scanning members..."

    invalid_members = []

    members.each do |member|
      missing_accounts  = ::Members::FetchMissingAccounts.new(
                            config: {
                              member: member
                            }
                          ).execute!

      if missing_accounts.any?
        puts "Member: #{member.full_name} (#{member.id})"
        puts "Status: #{member.status}"
        puts "Branch: #{member.branch.to_s}"
        puts "Center: #{member.center.to_s}"
        puts "Missing Accounts:"

        missing_accounts.each do |o|
          puts "--> Account Type: #{o[:account_type]} Account Subtype: #{o[:account_subtype]}"
        end

        puts "======================================="

        invalid_members << {
          member: member,
          missing_accounts: missing_accounts
        }
      end
    end

    puts "Found invalid members: #{missing_accounts.size}"
  end
end
