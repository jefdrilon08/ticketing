class ProcessXWeeksToPay < ApplicationJob
  queue_as :default

  def perform(args)
    begin 
      record  = DataStore.x_weeks_to_pay.find(args[:data_store_id])
      branch  = Branch.find(record.meta.with_indifferent_access[:branch_id])
      as_of   = record.meta.with_indifferent_access[:as_of].to_date
      x       = record.meta.with_indifferent_access[:x].to_i

      record.update!(status: "processing")

      config  = {
        branch: branch,
        as_of: as_of,
        x: x
      }

      data_result = ::Branches::ComputeXWeeksToPay.new(
                      config: config
                    ).execute!

      record.update!(
        status: "done",
        data: data_result
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
