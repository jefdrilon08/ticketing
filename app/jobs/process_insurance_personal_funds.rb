class ProcessInsurancePersonalFunds < ApplicationJob
  queue_as :default

  def perform(args)
    record  = DataStore.find(args[:id])
    branch  = Branch.find(record.meta.with_indifferent_access[:branch_id])
    as_of   = record.meta.with_indifferent_access[:as_of].to_date
    member_status  = record.meta.with_indifferent_access[:member_status]

    begin
      config  = {
        id: record.id,
        as_of: as_of,
        branch: branch,
        member_status: member_status
      }

      data_store  = DataStores::SaveInsurancePersonalFunds.new(
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
