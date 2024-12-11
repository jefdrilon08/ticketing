class ProcessSoaFunds < ApplicationJob
  queue_as :default

  def perform(args)
    record      = DataStore.soa_funds.find(args[:id])
    meta        = record.meta.with_indifferent_access
    branch      = Branch.find(meta[:branch_id])
    start_date  = meta[:start_date].to_date
    end_date    = meta[:end_date].to_date

    begin 
      config  = {
        id: record.id,
        branch: branch,
        start_date: start_date,
        end_date: end_date,
        data_store_type: args[:data_store_type]
      }

      data_store  = ::DataStores::SaveSoaFunds.new(
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
