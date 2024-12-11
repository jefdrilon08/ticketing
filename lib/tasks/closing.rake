namespace :closing do
  task :daily_branch => :environment do
    if ENV['BRANCH_ID'].present?
      branch        = ReadOnlyBranch.find(ENV['BRANCH_ID'])
      transacted_at = ENV['TRANSACTED_AT'] || Date.today

      MemberAccount.where(branch_id: branch.id).find_in_batches(batch_size: 100) do |group|
        group.each do |o|
          ::MemberAccounts::SaveMemberAccountDailyStatement.new(
            member_account: o,
            transacted_at: transacted_at
          ).execute!
        end
      end
    end
  end
end
