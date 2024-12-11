class ProcessTrialBalance < ApplicationJob
  #queue_as :default
  queue_as :accounting

  def perform(args)
    data_store      = DataStore.find(args[:id])
    data_store_type = args[:data_store_type]

    begin
      branch          = Branch.find(data_store.meta["branch_id"])
      start_date      = data_store.meta["start_date"].to_date
      end_date        = data_store.meta["end_date"].to_date

      accounting_fund = AccountingFund.where(id: data_store.meta["accounting_fund_id"]).first
      user            = User.find(data_store.meta["user"]["id"])

      config  = {
        start_date: start_date,
        end_date: end_date,
        branch: branch || "",
        accounting_fund: accounting_fund || ""
      }

     # old
     data  = ::Accounting::FetchTrialBalance.new(
               config: config
             ).execute!

     data_store.update!(data: data, status: "done")
      
      # Delete all accounting_code_balances with same parameters
      # AccountingCodeBalance.where(
      #   branch_id:          branch.id,
      #   start_date:         start_date,
      #   end_date:           end_date,
      #   accounting_fund_id: accounting_fund.try(:id)
      # ).delete_all

      # ReadOnlyAccountingCode.all.each do |a|
      #   acb = AccountingCodeBalance.create!(
      #           status:             "processing",
      #           branch_id:          branch.id,
      #           start_date:         start_date,
      #           end_date:           end_date,
      #           accounting_fund_id: accounting_fund.try(:id),
      #           accounting_code:    a,
      #           category:           a.category
      #         )

      #   ProcessAccountingCodeBalance.perform_later({
      #     id:                 acb.id,
      #     branch_id:          branch.id,
      #     accounting_code_id: a.id,
      #     accounting_fund_id: accounting_fund.try(:id),
      #     start_date:         start_date,
      #     end_date:           end_date
      #   })
      # end
    rescue Exception => e
      data_store.update!(
        status: "error",
        data: {
          exception: e,
          application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
        }
      )
    end
  end
end
