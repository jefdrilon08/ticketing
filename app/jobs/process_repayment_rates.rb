class ProcessRepaymentRates < ApplicationJob
  queue_as :default

  def perform(args)
    record  = DataStore.repayment_rates.find(args[:id])
    meta    = record.meta.with_indifferent_access
    branch  = Branch.find(meta[:branch_id])
    as_of   = meta[:as_of].to_date

    begin 
      config  = {
        id: record.id,
        branch: branch,
        as_of: as_of,
        data_store_type: args[:data_store_type]
      }

      data_store = ::DataStores::SaveRepaymentRates.new(
        config: config
      ).execute!

      # Create daily_branch_metric
      ::Branches::SaveDailyBranchMetric.new(
        branch: branch,
        as_of:  as_of
      ).execute!

      # Create DwBranchActiveLoanCount
      ::DataWarehouse::SaveDwBranchActiveLoanCount.new(
        branch: branch,
        as_of:  as_of
      ).execute!

      # Create DwBranchLoanProductActiveLoanCount per Loan Product
      LoanProduct.all.each do |loan_product|
        ::DataWarehouse::SaveDwBranchLoanProductActiveLoanCount.new(
          branch:       branch,
          as_of:        as_of,
          loan_product: loan_product
        ).execute!
      end

#<<<<<<< HEAD
#=======
#      # Perform notification on general_channel
#      ActionCable.server.broadcast(
#        "notifications_channel",
#        {
#          notifId:    "#{record.id}",
#          title:      "Done Processing",
#          link:       "/data_stores/repayment_rates/#{record.id}",
#          updatedAt:  record.updated_at.strftime("%b %d, %Y %H:%M"),
#          content:    "Repayment Rates Report has been processed!",
#          branchId:   branch.id
#        }
#      )

#>>>>>>> develop
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
