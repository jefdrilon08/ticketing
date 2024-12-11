class ProcessInsuranceMonthlyClosingCollection < ApplicationJob
  queue_as :default

  def perform(args)
    insurance_monthly_closing_collection  = InsuranceMonthlyClosingCollection.find(args[:insurance_monthly_closing_collection_id])

    user          = User.find(args[:user_id])
    branch        = Branch.find(args[:branch_id])
    closing_date  = args[:closing_date].to_date

    begin
      insurance_monthly_closing_collection  = ::InsuranceMonthlyClosingCollections::Save.new(
                                                config: {
                                                  insurance_monthly_closing_collection: insurance_monthly_closing_collection,
                                                  user: user,
                                                  branch: branch,
                                                  closing_date: closing_date
                                                }
                                              ).execute!
    rescue Exception => e
      insurance_monthly_closing_collection.update!(
        status: "error",
        data: {
          exception: e,
          application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
        }
      )
    end
  end
end
