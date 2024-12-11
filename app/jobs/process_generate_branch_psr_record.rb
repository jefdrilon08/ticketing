class ProcessGenerateBranchPsrRecord < ApplicationJob
  queue_as :accounting

  def perform(args)
    branch_psr_record = BranchPsrRecord.find(args[:id])

    branch        = branch_psr_record.branch
    closing_date  = branch_psr_record.closing_date

    cmd = ::Branches::GeneratePsrRecord.new(
      branch:             branch,
      closing_date:       closing_date,
      branch_psr_record:  branch_psr_record
    )

    branch.update!(current_date: nil)

    cmd.execute!
  end
end
