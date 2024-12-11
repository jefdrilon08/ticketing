class ProcessShareCapitalInvoluntary < ApplicationJob
  queue_as :default

  def perform(args)
    record    = DataStore.find(args[:id])
    user      = User.find(args[:user_id])

    begin
      config  = {
        id: record.id,
        user: user.id
      }
      

      data_store  = ::DataStores::GenerateShareCapitalInvoluntary.new(
                      config: config
                    ).execute!
     
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
