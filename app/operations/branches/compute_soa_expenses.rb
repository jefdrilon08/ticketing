module Branches
  class ComputeSoaExpenses
    def initialize(config:)
      @config     = config
      @start_date = @config[:start_date]
      @end_date   = @config[:end_date]
      @branch     = @config[:branch]

      @loans  = Loan.joins(:member).active_or_paid.where(
                  "loans.branch_id = ? AND date_approved >= ? AND date_approved <= ?",
                  @branch.id,
                  @start_date,
                  @end_date
                ).order("members.last_name ASC")

      @data = {
        start_date: @start_date,
        end_date: @end_date,
        branch: {
          id: @branch.id,
          name: @branch.name
        },
        grand_total: 0.00,
        records: [],
        centers: [],
        loan_products: []
      }
    end

    def execute!
      @loans.each do |loan|
        @data[:records] << ::Loans::BuildSoaExpenseObject.new(loan: loan).execute!
      end

      # Setup centers
      @data[:centers] = Center.where(
                          id: @loans.pluck(:center_id).uniq
                        ).order("name ASC").map{ |o| { id: o.id, name: o.name } }

      # Setup loan products
      @data[:loan_products] = LoanProduct.where(
                                id: @loans.pluck(:loan_product_id).uniq
                              ).order("priority ASC").map{ |o| { id: o.id, name: o.name } }

      # Grand total
      @data[:grand_total] = @loans.sum(:principal).round(2)

      @data
    end
  end
end
