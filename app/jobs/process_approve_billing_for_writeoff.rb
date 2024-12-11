class ProcessApproveBillingForWriteoff < ApplicationJob
  queue_as :default

  def perform(args)
    record    = args[:data_store]
    user      = args[:user]

    begin
      config  = {
        record: record,
        user: user
      }
      record  = ::BillingForWriteoff::Approve.new(
                      config: config
                    ).execute!
      record.update!(status: "approved")


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
