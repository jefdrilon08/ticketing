class ProcessAccountingCodeBalance < ApplicationJob
  queue_as :operations

  def perform(args)
    accounting_code_balance = AccountingCodeBalance.find(args[:id])

    branch          = ReadOnlyBranch.find(args[:branch_id])
    accounting_code = ReadOnlyAccountingCode.find(args[:accounting_code_id])
    accounting_fund = ReadOnlyAccountingFund.find_by_id(args[:accounting_fund_id])
    start_date      = args[:start_date].to_date
    end_date        = args[:end_date].to_date

    data  = ::Accounting::TrialBalances::FetchAccountingCodeBalance.new(
              config: {
                accounting_code: accounting_code,
                branch: branch,
                start_date: start_date,
                end_date: end_date,
                accounting_fund: accounting_fund
              }
            ).execute!

    accounting_code_balance.total_beginning_debit   = data[:total_beginning_debit]
    accounting_code_balance.total_beginning_credit  = data[:total_beginning_credit]
    accounting_code_balance.total_current_debit     = data[:total_current_debit]
    accounting_code_balance.total_current_credit    = data[:total_current_credit]
    accounting_code_balance.total_ending_debit      = data[:total_ending_debit]
    accounting_code_balance.total_ending_credit     = data[:total_ending_credit]

    accounting_code_balance.status = "done"

    accounting_code_balance.save!

    if AccountingCodeBalance.processing.where(branch_id: branch.id, accounting_fund_id: accounting_fund.try(:id), start_date: start_date, end_date: end_date).count == 0
      data_store  = DataStore.trial_balances.where(
                      "meta->>'branch_id' = ? AND start_date = ? AND end_date = ?",
                      branch.id,
                      start_date,
                      end_date
                    ).first

      if data_store.blank?
        raise "Trial balance not found for branch_id = #{branch.id} start_date = #{start_date} end_date = #{end_date}"
      end

      data_store.data["start_date"] = start_date
      data_store.data["end_date"]   = end_date
      data_store.data["branch"]     = branch
      
      data_store.data["entries"] = []

      accounting_code_balances = AccountingCodeBalance.where(branch_id: branch.id, accounting_fund_id: accounting_fund.try(:id), start_date: start_date, end_date: end_date)

      # ASSETS
      accounting_code_balances.assets.each do |o|
        if o.total_beginning_debit > 0 or o.total_beginning_credit > 0 or o.total_current_debit > 0 or o.total_current_credit > 0 or o.total_ending_debit > 0 or o.total_ending_credit > 0 
          data_store.data["entries"] << {
            id:               o.accounting_code_id,
            name:             o.accounting_code.name,
            code:             o.accounting_code.code,
            beginning_debit:  o.total_beginning_debit,
            beginning_credit: o.total_beginning_credit,
            current_debit:    o.total_current_debit,
            current_credit:   o.total_current_credit,
            ending_debit:     o.total_ending_debit,
            ending_credit:    o.total_ending_credit
          }
        end
      end

      accounting_code_balances.liabilities.each do |o|
        if o.total_beginning_debit > 0 or o.total_beginning_credit > 0 or o.total_current_debit > 0 or o.total_current_credit > 0 or o.total_ending_debit > 0 or o.total_ending_credit > 0 
          data_store.data["entries"] << {
            id:               o.accounting_code_id,
            name:             o.accounting_code.name,
            code:             o.accounting_code.code,
            beginning_debit:  o.total_beginning_debit,
            beginning_credit: o.total_beginning_credit,
            current_debit:    o.total_current_debit,
            current_credit:   o.total_current_credit,
            ending_debit:     o.total_ending_debit,
            ending_credit:    o.total_ending_credit
          }
        end
      end

      accounting_code_balances.equities.each do |o|
        if o.total_beginning_debit > 0 or o.total_beginning_credit > 0 or o.total_current_debit > 0 or o.total_current_credit > 0 or o.total_ending_debit > 0 or o.total_ending_credit > 0 
          data_store.data["entries"] << {
            id:               o.accounting_code_id,
            name:             o.accounting_code.name,
            code:             o.accounting_code.code,
            beginning_debit:  o.total_beginning_debit,
            beginning_credit: o.total_beginning_credit,
            current_debit:    o.total_current_debit,
            current_credit:   o.total_current_credit,
            ending_debit:     o.total_ending_debit,
            ending_credit:    o.total_ending_credit
          }
        end
      end

      accounting_code_balances.fund_balance.each do |o|
        if o.total_beginning_debit > 0 or o.total_beginning_credit > 0 or o.total_current_debit > 0 or o.total_current_credit > 0 or o.total_ending_debit > 0 or o.total_ending_credit > 0 
          data_store.data["entries"] << {
            id:               o.accounting_code_id,
            name:             o.accounting_code.name,
            code:             o.accounting_code.code,
            beginning_debit:  o.total_beginning_debit,
            beginning_credit: o.total_beginning_credit,
            current_debit:    o.total_current_debit,
            current_credit:   o.total_current_credit,
            ending_debit:     o.total_ending_debit,
            ending_credit:    o.total_ending_credit
          }
        end
      end

      accounting_code_balances.income.each do |o|
        if o.total_beginning_debit > 0 or o.total_beginning_credit > 0 or o.total_current_debit > 0 or o.total_current_credit > 0 or o.total_ending_debit > 0 or o.total_ending_credit > 0 
          data_store.data["entries"] << {
            id:               o.accounting_code_id,
            name:             o.accounting_code.name,
            code:             o.accounting_code.code,
            beginning_debit:  o.total_beginning_debit,
            beginning_credit: o.total_beginning_credit,
            current_debit:    o.total_current_debit,
            current_credit:   o.total_current_credit,
            ending_debit:     o.total_ending_debit,
            ending_credit:    o.total_ending_credit
          }
        end
      end

      accounting_code_balances.expenses.each do |o|
        if o.total_beginning_debit > 0 or o.total_beginning_credit > 0 or o.total_current_debit > 0 or o.total_current_credit > 0 or o.total_ending_debit > 0 or o.total_ending_credit > 0 
          data_store.data["entries"] << {
            id:               o.accounting_code_id,
            name:             o.accounting_code.name,
            code:             o.accounting_code.code,
            beginning_debit:  o.total_beginning_debit,
            beginning_credit: o.total_beginning_credit,
            current_debit:    o.total_current_debit,
            current_credit:   o.total_current_credit,
            ending_debit:     o.total_ending_debit,
            ending_credit:    o.total_ending_credit
          }
        end
      end

      data_store.data["entries"] << {
        id: "",
        name: "",
        code: "TOTAL",
        beginning_debit:  accounting_code_balances.sum(:total_beginning_debit),
        beginning_credit: accounting_code_balances.sum(:total_beginning_credit),
        current_debit:    accounting_code_balances.sum(:total_current_debit),
        current_credit:   accounting_code_balances.sum(:total_current_credit),
        ending_debit:     accounting_code_balances.sum(:total_ending_debit),
        ending_credit:    accounting_code_balances.sum(:total_ending_credit)
      }

      data_store.update!(
        status: "done"
      )
    end
  end
end
