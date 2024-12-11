class ProcessBranchDailyClosing < ApplicationJob
  queue_as :backend

  def perform(args)
    branch        = ReadOnlyBranch.find(args[:id])
    transacted_at = args[:transacted_at] || Date.today

    ReadOnlyMemberAccount.where(branch_id: branch.id).find_in_batches(batch_size: 100) do |group|
      group.each do |o|
        ::MemberAccounts::SaveMemberAccountDailyStatement.new(
          member_account: o,
          transacted_at: transacted_at
        ).execute!
      end
    end
  end
end
