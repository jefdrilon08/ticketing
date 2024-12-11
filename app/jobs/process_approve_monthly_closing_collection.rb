class ProcessApproveMonthlyClosingCollection < ApplicationJob
  queue_as :operations

  def perform(args)
    monthly_closing_collection  = MonthlyClosingCollection.find(args[:monthly_closing_collection_id])
    user                        = User.find(args[:user_id])

    config = {
      monthly_closing_collection: monthly_closing_collection,
      user: user
    }

    begin
      ActiveRecord::Base.transaction do
        monthly_closing_collection  = ::MonthlyClosingCollections::Approve.new(
                                        config: config
                                      ).execute!

        ActivityLog.create!(
          content: "#{user.full_name} approved monthly closing collection",
          activity_type: "approval",
          data: {
            user_id: user.id,
            monthly_closing_collection_id: monthly_closing_collection.id
          }
        )
      end
    rescue Exception => e
      monthly_closing_collection.update!(
        status: "pending"
      )
    end
  end
end
