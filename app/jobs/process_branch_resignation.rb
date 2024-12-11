class ProcessBranchResignation < ApplicationJob
  queue_as :default

  def perform(args)
    begin 
      record      = args[:record]
      branch      = Branch.find(record.meta.with_indifferent_access[:branch_id])
      start_date  = record.meta.with_indifferent_access[:start_date].to_date
      end_date    = record.meta.with_indifferent_access[:end_date].to_date

      record.update!(status: "processing")

      config  = {
        id: record.id,
        branch: branch,
        start_date: start_date,
        end_date: end_date,
        data_store_type: args[:data_store_type]
      }

      data_store  = ::DataStores::SaveBranchResignation.new(
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
