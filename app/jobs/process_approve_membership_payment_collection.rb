class ProcessApproveMembershipPaymentCollection < ApplicationJob
  queue_as :operations

  def perform(args)
    membership_payment_collection = MembershipPaymentCollection.find(args[:id])
    user                          = User.find(args[:user_id])

    begin
      config  = {
        membership_payment_collection: membership_payment_collection,
        user: user
      }
      
      ActiveRecord::Base.transaction do
        ::MembershipPaymentCollections::Approve.new(
          config: config
        ).execute!

        ActivityLog.create!(
          content: "#{user.full_name} approved membership_payment_collection",
          activity_type: "approval",
          data: {
            user_id: user.id,
            membership_payment_collection_id: membership_payment_collection.id
          }
        )
      end
    rescue Exception => e
      membership_payment_collection.update!(
        status: "pending"
      )
    end
  end
end
