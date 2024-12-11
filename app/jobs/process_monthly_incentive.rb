class ProcessMonthlyIncentive < ApplicationJob
  queue_as :default

  def perform(args)
    begin
      record  = DataStore.monthly_incentives.find(args[:data_store_id])

      user    = User.find(args[:user_id])
      branch  = Branch.find(args[:branch_id])
      year    = args[:year]
      month   = args[:month]

      record.update!(status: "processing")

      config  = {
        id: record.id,
        branch: branch,
        year: year,
        month: month
      }
      
      data_result = ::DataStores::GenerateMonthlyIncentive.new(
                      config: config
                    ).execute!

      record.update!(
        data: data_result,
        status: "done"
      )
    rescue Exception => e
      record.update!(
        status: "error",
        data: {
          exception: e,
          application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
        }
      )
    end
  end
end
