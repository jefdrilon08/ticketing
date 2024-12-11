class ProcessGeneralLedger < ApplicationJob
  #queue_as :default
  queue_as :accounting

  def perform(args)
    data_store      = DataStore.find(args[:id])
    data_store_type = args[:data_store_type]

    begin
      branch          = Branch.find(data_store.meta["branch_id"])
      start_date      = data_store.meta["start_date"].to_date
      end_date        = data_store.meta["end_date"].to_date

      accounting_fund = AccountingFund.find_by_id(data_store.meta["accounting_fund_id"])
      user            = User.find(data_store.meta["user"]["id"])

      config  = {
        start_date: start_date,
        end_date: end_date,
        branch: branch || "",
        accounting_fund: accounting_fund || ""
      }

     data  = ::Accounting::GenerateGeneralLedger.new(
               config: config
             ).execute!

     data_store.update!(data: data, status: "done")
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
