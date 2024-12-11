class ProcessApproveIcpr < ApplicationJob
  queue_as :default

  def perform(args)
    data_store  = DataStore.find(args[:id])
    user        = User.find(args[:user_id])

    begin
      config  = {
        data_store: data_store,
        user: user
      }

      data_store  = ::Icpr::Approve.new(
                      config: config
                    ).execute!

      data_store.update!(status: "approved")
    rescue Exception => e
      data_store.update!(
        status: "error",
        data: {
          exception: e,
          application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
        }
      )
    end
  end
end
