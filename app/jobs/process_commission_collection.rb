class ProcessCommissionCollection < ApplicationJob
  queue_as :default

  def perform(args)
    commission_collection  = CommissionCollection.find(args[:commission_collection_id])

    user          = User.find(args[:user_id])
    category      = args[:category]
    start_date    = args[:start_date].to_date
    end_date      = args[:end_date].to_date

    begin
      commission_collection  = ::CommissionCollections::Save.new(
                                    config: {
                                      commission_collection: commission_collection,
                                      user: user,
                                      category: category,
                                      start_date: start_date,
                                      end_date: end_date
                                    }
                                  ).execute!
    rescue Exception => e
      commission_collection.update!(
        status: "error",
        data: {
          exception: e,
          application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
        }
      )
    end
  end
end
