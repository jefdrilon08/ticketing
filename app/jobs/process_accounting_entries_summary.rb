class ProcessAccountingEntriesSummary < ApplicationJob
  queue_as :default

  def perform(args)
    record      = DataStore.find(args[:record_id])
    meta        = record.meta.with_indifferent_access
    branch      = Branch.find(meta[:branch_id])
    start_date  = meta[:start_date].to_date
    end_date    = meta[:end_date].to_date
    book        = meta[:book]

    begin 
      config  = {
        id: record.id,
        branch: branch,
        start_date: start_date,
        end_date: end_date,
        book: book,
        data_store_type: args[:data_store_type]
      }

      data_store  = ::DataStores::SaveAccountingEntriesSummary.new(
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
