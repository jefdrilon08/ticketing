class ProcessApproveCommissionCollection < ApplicationJob
  queue_as :operations

  def perform(args)
    commission_collection  = CommissionCollection.find(args[:commission_collection_id])
    user                   = User.find(args[:user_id])

    config = {
      commission_collection: commission_collection,
      user: user
    }

    begin
      ::CommissionCollections::Approve.new(
                                          config: config
                                        ).execute!

      ActivityLog.create!(
        content: "#{user.full_name} approved commission collection",
        activity_type: "approval",
        data: {
          user_id: user.id,
          commission_collection_id: commission_collection.id
        }
      )
    rescue Exception => e
      commission_collection.update!(
        status: "pending"
      )
    end
  end
end
