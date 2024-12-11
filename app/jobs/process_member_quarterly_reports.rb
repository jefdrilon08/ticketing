class ProcessMemberQuarterlyReports < ApplicationJob
  queue_as :default

  def perform(args)
    begin 
      record  = args[:record]
      # branch  = Branch.find(record.meta.with_indifferent_access[:branch_id])
      as_of   = record.meta.with_indifferent_access[:as_of].to_date

      record.update!(status: "processing")

      config  = {
        id: record.id,
        # branch: branch,
        as_of: as_of,
        data_store_type: args[:data_store_type]
      }

      data_store  = ::DataStores::SaveMemberQuarterlyReports.new(
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