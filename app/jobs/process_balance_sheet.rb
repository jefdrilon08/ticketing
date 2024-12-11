class ProcessBalanceSheet < ApplicationJob
  queue_as :default

  def perform(args)
    record        = DataStore.find(args[:id])
    branch        = Branch.find(record.meta.with_indifferent_access[:branch_id])
    month         = record.meta.with_indifferent_access[:month]
    year          = record.meta.with_indifferent_access[:year]
    
    record.update!(status: "processing")

    begin
      config  = {
        year: year,
        month: month,
        branch: branch
      }

      record.data = ::Accounting::GenerateBalanceSheet.new(
                      config: config
                    ).execute!

      record.status = "done"

      record.save!

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
