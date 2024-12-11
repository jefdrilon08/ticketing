class ProcessMonthlyAccountingCodeSummaries < ApplicationJob
  queue_as :default

  def perform(args)
    branch_id           = args[:branch_id]
    year                = args[:year]
    month               = args[:month]

    ReadOnlyAccountingCode.all.each do |a|
      ProcessMonthlyAccountingCodeSummary.perform_later({
        branch_id:          branch_id,
        accounting_code_id: a.id,
        year:               year,
        month:              month
      })
    end
  end
end
