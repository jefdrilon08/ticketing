namespace :diagnosis do
  task :subsidiary_double_posting => :environment do
    branch          = Branch.find(ENV['BRANCH_ID'])
    account_subtype = ENV['ACCOUNT_SUBTYPE']

    member_accounts = MemberAccount.where(
                        "branch_id = ? AND account_subtype = ?",
                        branch.id,
                        account_subtype
                      )

    invalid_transactions = []

    member_accounts.each do |o|
      if o.savings?
        domain = "savings_accounts"
      elsif o.insurance?
        domain = "insurance_accounts"
      elsif o.equity?
        domain = "equity_accounts"
      else
        raise "Invalid account_type #{o.account_type}"
      end

      puts "Scanning #{o.id}..."
      balance = 0.00
      valid   = true

      txs = AccountTransaction.where(
              subsidiary_id: o.id
            ).order(
              "transacted_at ASC, updated_at ASC"
            )

      txs.each_with_index do |t, i|
        if i > 0 and txs[i - 1].amount.to_d.round(2) == t.amount.to_d.round(2) and txs[i - 1].transacted_at.to_date == t.transacted_at.to_date and txs[i - 1].transaction_type == t.transaction_type

          invalid_transactions << {
            member_account: {
              id: o.id,
              account_subtype: account_subtype,
              account_type: o.account_type
            },
            url: "http://#{ENV['HOST']}/#{domain}/#{o.id}",
            t1_id: txs[i - 1].id,
            t2_id: t.id
          }
        end
      end
    end

    if invalid_transactions.size > 0
      invalid_transactions.each_with_index do |t, i|
        puts "#{i + 1}: #{t[:member_account][:id]} --> #{t[:url]} t1: #{t[:t1_id]} t2: #{t[:t2_id]}"
      end
    else
      puts "No subsidiary double inserted detected..."
    end

    puts "Done..."
  end

  task :member_accounts => :environment do
    branch          = Branch.find(ENV['BRANCH_ID'])
    account_subtype = ENV['ACCOUNT_SUBTYPE']
    repair          = ENV['REPAIR'].present? ? true : false

    invalid_accounts = []

    member_accounts = MemberAccount.where(
                        "branch_id = ? AND account_subtype = ?",
                        branch.id,
                        account_subtype
                      )

    member_accounts.each do |a|
      puts "Scanning #{a.id}..."
      balance = 0.00
      valid   = true

      AccountTransaction.where(
        subsidiary_id: a.id
      ).order(
        "transacted_at ASC, updated_at ASC"
      ).each do |t|
        if balance != t.data["beginning_balance"].to_d.round(2)
          valid = false
        end

        if t.deposit?
          balance += t.amount
        elsif t.withdraw?
          balance -= t.amount
        end

        balance = balance.round(2)

        if balance != t.data["ending_balance"].to_d.round(2)
          valid = false
        end
      end

      if !valid
        invalid_accounts << a
      end
    end

    size  = invalid_accounts.size

    if size > 0
      puts "Found #{size} accounts..."
      invalid_accounts.each_with_index do |o, i|
        if o.savings?
          domain = "savings_accounts"
        elsif o.insurance?
          domain = "insurance_accounts"
        elsif o.equity?
          domain = "equity_accounts"
        else
          raise "Invalid account_type #{o.account_type}"
        end

        puts "#{i+1} / #{size}: #{repair ? "Repairing " : ""}http://#{ENV['HOST']}/#{domain}/#{o.id}"

        if repair
          ::MemberAccounts::Rehash.new(
            member_account: o
          ).execute!

          sleep(0.1)
        end
      end
    else
      puts "No invalid accouts found!"
    end
  end
end
