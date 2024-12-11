class ProcessBranchLoansStats < ApplicationJob
  queue_as :default

  def perform(args)
    record  = DataStore.find(args[:id])
    branch  = Branch.find(record.meta.with_indifferent_access[:branch_id])
    as_of   = record.meta.with_indifferent_access[:as_of].to_date

    begin 
      config  = {
        id: record.id,
        branch: branch,
        as_of: as_of,
        include_centers: args[:include_centers],
        data_store_type: args[:data_store_type]
      }

      data_store  = ::DataStores::SaveBranchLoansStats.new(
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
