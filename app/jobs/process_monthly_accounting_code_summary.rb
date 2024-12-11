class ProcessMonthlyAccountingCodeSummary < ApplicationJob
  queue_as :default

  def perform(args)
    branch_id           = args[:branch_id]
    accounting_code_id  = args[:accounting_code_id]
    year                = args[:year]
    month               = args[:month]

    branch          = ReadOnlyBranch.find(branch_id)
    accounting_code = ReadOnlyAccountingCode.find(accounting_code_id)

    ::Accounting::AccountingCodes::SaveMonthlySummary.new(
      accounting_code: accounting_code,
      branch: branch,
      year: year,
      month: month
    ).execute!
  end
end
