class ProcessApproveAdditionalShare < ApplicationJob
  queue_as :default

  def perform(args)
    record    = DataStore.find(args[:data_store])
    user      = User.find(args[:user])

    begin
      config  = {
        record: record,
        user: user
      }
      record  = ::AdditionalShare::Approve.new(
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
