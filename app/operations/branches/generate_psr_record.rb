module Branches
  class GeneratePsrRecord
    attr_accessor :record

    def initialize(branch:, closing_date:, branch_psr_record: nil)
      @branch       = branch
      @closing_date = closing_date.to_date

      @record = branch_psr_record

      if @record.blank?
        @record = BranchPsrRecord.new(
          branch:         @branch,
          closing_date:   @closing_date,
          closing_year:   @closing_date.year,
          closing_month:  @closing_date.month
        )
      end

      @data = {}
    end

    def execute!
      @closing_records = ::ClosingRecords::FetchClosingRecords.new(
        branch: @branch,
        closing_date: @closing_date
      ).execute!

      generate_member_counts!
      generate_loan_data!
      generate_aging_data!
      generate_fs_data!

      @record.data = @data

      @record.status = "done"

      @record.save!

      @record
    end

    private

    def generate_fs_data!
      closing_record = @closing_records.select{ |o| o[:type] == "INCOME_STATEMENT" }.first

      data_store  = ReadOnlyDataStore.find(closing_record[:data_store_id])
      data        = data_store.data.with_indifferent_access

      @data[:gross_income]                    = data[:total_income]
      @data[:operating_expense]               = data[:total_expenses]
      @data[:net_income_before_admin_expense] = data[:total_net_income]
    end

    def generate_aging_data!
      closing_record = @closing_records.select{ |o| o[:type] == "MANUAL_AGING" }.first

      data_store  = ReadOnlyDataStore.find(closing_record[:data_store_id])
      data        = data_store.data.with_indifferent_access
    end

    def generate_loan_data!
      closing_record = @closing_records.select{ |o| o[:type] == "REPAYMENT_RATES" }.first

      data_store  = ReadOnlyDataStore.find(closing_record[:data_store_id])
      data        = data_store.data.with_indifferent_access

      @data[:total_active_loans]              = data[:records].size
      @data[:total_principal]                 = data[:records].inject(0){ |sum, o| sum + o[:principal] }
      @data[:total_interest]                  = data[:records].inject(0){ |sum, o| sum + o[:interest] }
      @data[:total_total]                     = data[:records].inject(0){ |sum, o| sum + o[:total] }
      @data[:total_principal_due]             = data[:records].inject(0){ |sum, o| sum + o[:principal_due] }
      @data[:total_interest_due]              = data[:records].inject(0){ |sum, o| sum + o[:interest_due] }
      @data[:total_total_due]                 = data[:records].inject(0){ |sum, o| sum + o[:total_due] }
      @data[:total_principal_paid]            = data[:records].inject(0){ |sum, o| sum + o[:principal_paid] }
      @data[:total_interest_paid]             = data[:records].inject(0){ |sum, o| sum + o[:interest_paid] }
      @data[:total_total_paid]                = data[:records].inject(0){ |sum, o| sum + o[:total_paid] }
      @data[:total_principal_paid_due]        = data[:records].inject(0){ |sum, o| sum + o[:principal_paid_due] }
      @data[:total_interest_paid_due]         = data[:records].inject(0){ |sum, o| sum + o[:interest_paid_due] }
      @data[:total_total_paid_due]            = data[:records].inject(0){ |sum, o| sum + o[:total_paid_due] }
      @data[:total_principal_balance]         = data[:records].inject(0){ |sum, o| sum + o[:principal_balance] }
      @data[:total_interest_balance]          = data[:records].inject(0){ |sum, o| sum + o[:interest_balance] }
      @data[:total_total_balance]             = data[:records].inject(0){ |sum, o| sum + o[:total_balance] }
      @data[:total_overall_principal_balance] = data[:records].inject(0){ |sum, o| sum + o[:overall_principal_balance] }
      @data[:total_overall_interest_balance]  = data[:records].inject(0){ |sum, o| sum + o[:overall_interest_balance] }
      @data[:total_overall_balance]           = data[:records].inject(0){ |sum, o| sum + o[:overall_balance] }

      @data[:loans] = []

      ReadOnlyLoanProduct.all.each do |loan_product|
        loans = data[:records].select{ |o| o[:loan_product][:id] == loan_product.id }

        loan_product_category = loan_product.loan_product_category

        record = ::DataWarehouse::SaveDwBranchMonthlyLoanProductDisbursedCount.new(
          branch:       @branch,
          as_of:        @closing_date,
          loan_product: loan_product
        ).execute!

        @data[:loans] << {
          loan_product: {
            id: loan_product.id,
            name: loan_product.name
          },
          loan_product_category: {
            id: loan_product_category.id,
            name: loan_product_category.name
          },
          num_disbursed:              record.total,
          amount_disbursed:           record.amount,
          count:                      loans.size,
          principal:                  loans.inject(0){ |sum, o| sum + o[:principal] },
          interest:                   loans.inject(0){ |sum, o| sum + o[:interest] },
          total:                      loans.inject(0){ |sum, o| sum + o[:total] },
          principal_due:              loans.inject(0){ |sum, o| sum + o[:principal_due] },
          interest_due:               loans.inject(0){ |sum, o| sum + o[:interest_due] },
          total_due:                  loans.inject(0){ |sum, o| sum + o[:total_due] },
          principal_paid:             loans.inject(0){ |sum, o| sum + o[:principal_paid] },
          interest_paid:              loans.inject(0){ |sum, o| sum + o[:interest_paid] },
          total_paid:                 loans.inject(0){ |sum, o| sum + o[:total_paid] },
          principal_paid_due:         loans.inject(0){ |sum, o| sum + o[:principal_paid_due] },
          interest_paid_due:          loans.inject(0){ |sum, o| sum + o[:interest_paid_due] },
          total_paid_due:             loans.inject(0){ |sum, o| sum + o[:total_paid_due] },
          principal_balance:          loans.inject(0){ |sum, o| sum + o[:principal_balance] },
          interest_balance:           loans.inject(0){ |sum, o| sum + o[:interest_balance] },
          total_balance:              loans.inject(0){ |sum, o| sum + o[:total_balance] },
          overall_principal_balance:  loans.inject(0){ |sum, o| sum + o[:overall_principal_balance] },
          overall_interest_balance:   loans.inject(0){ |sum, o| sum + o[:overall_interest_balance] },
          overall_balance:            loans.inject(0){ |sum, o| sum + o[:overall_balance] }
        }

        @data[:total_num_disbursed]     = @data[:loans].inject(0){ |sum, o| sum + o[:num_disbursed] }
        @data[:total_amount_disbursed]  = @data[:loans].inject(0){ |sum, o| sum + o[:amount_disbursed] }
      end
    end

    def generate_member_counts!
      closing_record = @closing_records.select{ |o| o[:type] == "MEMBER_COUNTS" }.first

      data_store  = ReadOnlyDataStore.find(closing_record[:data_store_id])
      data        = data_store.data.with_indifferent_access

      @data[:active_total] = data[:counts][:active_members][:total].to_i + data[:counts][:pure_savers][:total].to_i + data[:counts][:loaners][:total].to_i + data[:counts][:inactive_members][:total].to_i

      @data[:active_female] = data[:counts][:active_members][:female].to_i + data[:counts][:pure_savers][:female].to_i + data[:counts][:loaners][:female].to_i + data[:counts][:inactive_members][:female].to_i

      @data[:active_male] = data[:counts][:active_members][:male].to_i + data[:counts][:pure_savers][:male].to_i + data[:counts][:loaners][:male].to_i + data[:counts][:inactive_members][:male].to_i

      @data[:pure_savers] = data[:counts][:pure_savers][:total]

      @data[:active_borrowers] = data[:counts][:loaners][:total]

      @data[:admitted] = data[:counts][:active_members][:total]

      @data[:resigned] = data[:counts][:active_members][:resigned]
    end
  end
end
