class ProcessApproveWithdrawalCollection < ApplicationJob
  queue_as :operations

  def perform(args)
    withdrawal_collection  = WithdrawalCollection.find(args[:id])
    user                = User.find(args[:user_id])

    begin
      config  = {
        withdrawal_collection: withdrawal_collection,
        user: user
      }
      
      ActiveRecord::Base.transaction do
        ::WithdrawalCollections::Approve.new(
          config: config
        ).execute!

        ActivityLog.create!(
          content: "#{user.full_name} approved withdrawal_collection",
          activity_type: "approval",
          data: {
            user_id: user.id,
            withdrawal_collection_id: withdrawal_collection.id
          }
        )
      end
    rescue Exception => e
      withdrawal_collection.update!(
        status: "pending"
      )
    end
  end
end
