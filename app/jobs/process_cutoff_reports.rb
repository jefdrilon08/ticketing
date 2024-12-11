class ProcessCutoffReports < ApplicationJob
  queue_as :default

  def perform(args)
    branches  = ReadOnlyBranch.all

    branches.each do |branch|
      current_date  = ::Utils::GetCurrentDate.new(
                        config: {
                          branch: branch
                        }
                      ).execute!

      as_of = current_date

      # REPAYMENT_RATES
      data_store_type = "REPAYMENT_RATES"

      record  = DataStore.create!(
                  status: "processing",
                  meta: {
                    branch_id: branch.id,
                    branch_name: branch.name,
                    as_of: as_of,
                    data_store_type: data_store_type
                  },
                  data: {
                    status: "processing"
                  }
                )

      ProcessRepaymentRates.perform_later({ id: record.id, data_store_type: data_store_type })

      # MANUAL AGING
      data_store_type = "MANUAL_AGING"

      record  = DataStore.create!(
                  status: "processing",
                  meta: {
                    branch_id: branch.id,
                    branch_name: branch.name,
                    as_of: as_of,
                    data_store_type: data_store_type
                  },
                  data: {
                    status: "processing"
                  }
                )

      ProcessManualAging.perform_later({ id: record.id, data_store_type: data_store_type })

      # PERSONAL_FUNDS
      data_store_type = "PERSONAL_FUNDS"

      record = DataStore.create!(
                  status: "processing",
                  meta: {
                    branch_id: branch.id,
                    branch_name: branch.name,
                    as_of: as_of,
                    data_store_type: data_store_type,
                    progress: 0
                  },
                  data: {
                    status: "processing"
                  }
                )

      ProcessPersonalFunds.perform_later({ id: record.id, data_store_type: data_store_type })
    end
  end
end
