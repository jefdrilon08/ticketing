class ProcessSaveDailyBranchMetric < ApplicationJob
  queue_as :default

  def perform(args)
    branch  = Branch.find(args[:branch_id])
    as_of   = args[:as_of].try(:to_date)

    begin
      daily_branch_metric = ::Branches::SaveDailyBranchMetric.new(
                              branch: branch,
                              as_of: as_of
                            ).execute!
    rescue Exception => e
      daily_branch_metric = DailyBranchMetric.where(
                              as_of: as_of,
                              branch_id: branch.id
                            ).first

      if daily_branch_metric.present?
        daily_branch_metric.update!(status: "error")
      end

      logger.error e.message
      logger.error e.backtrace.join("\n")
    end
  end
end
