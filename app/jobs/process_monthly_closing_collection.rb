class ProcessMonthlyClosingCollection < ApplicationJob
  queue_as :default

  def perform(args)
    monthly_closing_collection  = MonthlyClosingCollection.find(args[:monthly_closing_collection_id])

    user          = User.find(args[:user_id])
    branch        = Branch.find(args[:branch_id])
    closing_date  = args[:closing_date].to_date

    begin
      monthly_closing_collection  = ::MonthlyClosingCollections::Save.new(
                                      config: {
                                        monthly_closing_collection: monthly_closing_collection,
                                        user: user,
                                        branch: branch,
                                        closing_date: closing_date
                                      }
                                    ).execute!
    rescue Exception => e
      monthly_closing_collection.update!(
        status: "error",
        data: {
          exception: e,
          application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
        }
      )
    end
  end
end
