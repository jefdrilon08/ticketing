class ProcessAutorenewalAccounts < ApplicationJob
  queue_as :default

  def perform(args)
    member_accounts = MemberAccount.time_deposits
    branches        = Branch.all
    user            = User.find(args[:user_id])

    branches.each do |branch|
      branch_td_accounts  = member_accounts.where(
                              "member_accounts.branch_id = ? AND balance > 0",
                              branch.id
                            )

      current_date  = ::Utils::GetCurrentDate.new(
                        config: {
                          branch: branch
                        }
                      ).execute!

      branch_td_accounts.each do |account|
        latest_transaction  = AccountTransaction.approved_member_account_transactions(
                                account.id,
                                current_date
                              ).last

        if latest_transaction.present? and latest_transaction.deposit?
          start_date      = latest_transaction.transacted_at.to_date
          data            = latest_transaction.data.with_indifferent_access
          lock_in_period  = data[:lock_in_period]
          maturity_date   = start_date + lock_in_period[:num_days].days

          if current_date >= maturity_date
            data_store  = ::MemberAccounts::TimeDeposit::Autorenew.new(
                            config: {
                              member_account: account,
                              branch: branch,
                              user: user
                            }
                          ).execute!

            previous_lock_in_period = data_store.data.with_indifferent_access[:lock_in_period]

            ::MemberAccounts::TimeDeposit::ApproveAutorenewal.new(
              config: {
                data_store: data_store,
                member_account: account,
                user: user,
                lock_in_period: previous_lock_in_period
              }
            ).execute!
          end
        end
      end
    end
  end
end
