class ProcessApproveInsuranceMonthlyClosingCollection < ApplicationJob
  queue_as :operations

  def perform(args)
    insurance_monthly_closing_collection  = InsuranceMonthlyClosingCollection.find(args[:insurance_monthly_closing_collection_id])
    user                                  = User.find(args[:user_id])

    config = {
      insurance_monthly_closing_collection: insurance_monthly_closing_collection,
      user: user
    }

    begin
      ActiveRecord::Base.transaction do
        insurance_monthly_closing_collection  = ::InsuranceMonthlyClosingCollections::Approve.new(
                                                    config: config
                                                  ).execute!

        ActivityLog.create!(
          content: "#{user.full_name} approved insurance monthly closing collection",
          activity_type: "approval",
          data: {
            user_id: user.id,
            insurance_monthly_closing_collection_id: insurance_monthly_closing_collection.id
          }
        )
      end
    rescue Exception => e
      insurance_monthly_closing_collection.update!(
        status: "pending"
      )
    end
  end
end
