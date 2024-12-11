class ProcessWrittenOffReport < ApplicationJob
    queue_as :default
  
    def perform(args)
      begin
        record = DataStore.find(args[:data_store_id])
        branch_id = args[:branch_id]
        record.update!(status: "processing")
        config = {
          branch_id: branch_id,
          data_store_id: args[:data_store_id]
        }
        DataStores::GenerateWrittenOffReport.new(config: config).execute!
        record.update!(status: "done")
      rescue Exception => e
        record.update!(
          status: "error",
          data: {
            exception: e.message,
            application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
          }
        )
      end
    end
  end