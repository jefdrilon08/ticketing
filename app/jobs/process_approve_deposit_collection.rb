class ProcessApproveDepositCollection < ApplicationJob
  queue_as :operations

  def perform(args)
    deposit_collection  = DepositCollection.find(args[:id])
    user                = User.find(args[:user_id])

    begin
      config  = {
        deposit_collection: deposit_collection,
        user: user
      }
      
      ActiveRecord::Base.transaction do
        ::DepositCollections::Approve.new(
          config: config
        ).execute!

        ActivityLog.create!(
          content: "#{user.full_name} approved deposit_collection",
          activity_type: "approval",
          data: {
            user_id: user.id,
            deposit_collection_id: deposit_collection.id
          }
        )
      end
    rescue Exception => e
      deposit_collection.update!(
        status: "pending"
      )
    end
  end
end
