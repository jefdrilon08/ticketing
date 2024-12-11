class ProcessMonthlyNewAndResigned < ApplicationJob
  queue_as :default

  def perform(args)
    begin
      record  = DataStore.monthly_new_and_resigned.find(args[:data_store_id])

      branch  = Branch.find(args[:branch_id])
      year    = args[:year]
      month   = args[:month]

      config  = {
        branch: branch,
        year: year,
        month: month
      }
      
      if Settings.activate_microinsurance
        data_result = ::Branches::ComputeMonthlyNewAndResignedForMii.new(
                      config: config
                    ).execute!
      else
        data_result = ::Branches::ComputeMonthlyNewAndResigned.new(
                      config: config
                    ).execute!
      end

      record.update!(
        data: data_result,
        status: "done"
      )

      # Save DwBranchNewMemberCount
      ::DataWarehouse::SaveDwBranchNewAndResignedMemberCountFromMonthlyNewAndResigned.new(
        branch: branch,
        year: year,
        month: month,
        data: data_result
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
