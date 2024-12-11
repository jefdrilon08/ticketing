class ProcessBranchMemberCounts < ApplicationJob
  queue_as :default

  def perform(args)
    begin 
      record  = ReadOnlyDataStore.find(args[:record_id])
      branch  = ReadOnlyBranch.find(record.meta.with_indifferent_access[:branch_id])
      as_of   = record.meta.with_indifferent_access[:as_of].to_date

      config  = {
        id: record.id,
        branch: branch,
        as_of: as_of,
        data_store_type: args[:data_store_type]
      }

      data_store = ::DataStores::SaveMemberCounts.new(
        config: config
      ).execute!

      # Save DwBranchMemberCounts
      ::DataWarehouse::SaveDwBranchMemberCountsFromDataStore.new(
        data_store: data_store
      ).execute!

      # Create daily_branch_metric
      ::Branches::SaveDailyBranchMetric.new(
        branch: branch,
        as_of: as_of
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
