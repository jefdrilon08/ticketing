class ProcessWatchlist < ApplicationJob
  queue_as :default

  def perform(args)
    record  = DataStore.watchlists.find(args[:id])
    meta    = record.meta.with_indifferent_access
    branch  = Branch.find(meta[:branch_id])
    as_of   = meta[:as_of].to_date

    begin 
      config  = {
        id: record.id,
        branch: branch,
        as_of: as_of,
        data_store_type: args[:data_store_type]
      }

      data_store  = ::DataStores::SaveWatchlist.new(
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
