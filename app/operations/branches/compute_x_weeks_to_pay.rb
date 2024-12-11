module Branches
  class ComputeXWeeksToPay
    def initialize(config:)
      @config = config
      @branch = @config[:branch]
      @as_of  = @config[:as_of].try(:to_date) || Date.today
      @x      = @config[:x].try(:to_i) || 4

      @date_until = (@as_of + @x.weeks).to_date

      @data = {
        branch: {
          id: @branch.id,
          name: @branch.name
        },
        as_of: @as_of,
        x: @x,
        date_until: @date_until,
        loan_products: [],
        centers: [],
        officers: [],
        records: []
      }
    end

    def execute!
    #raise @date_untiil
      loans = Loan.active_or_paid.where(
                "maturity_date <= ? AND maturity_date >= ? AND branch_id = ?",
                @date_until,
                @as_of,
                @branch.id
              )
      
      loans.each do |loan|
      
       if (loan.maturity_date.to_date <= @date_until.to_date)
        temp_loan = ::Reports::GenerateLoanRepaymentReport.new(
                      config: {
                        loan: loan,
                        as_of: @as_of
                      }
                    ).execute!

          @data[:records] << temp_loan
        end
      end
      # Setup centers
      center_ids      = @data[:records].map{ |o| o[:center][:id] }
      @data[:centers] = Center.where(
                          id: center_ids
                        ).order("name ASC").map{ |o| { id: o.id, name: o.name } }

      # Setup loan_products
      loan_product_ids      = @data[:records].map{ |o| o[:loan_product][:id] }
      @data[:loan_products] = LoanProduct.where(
                                id: loan_product_ids
                              ).order("priority ASC").map{ |o| { id: o.id, name: o.name } }

      # Setup officers
      officer_ids       = @data[:records].map{ |o| o[:officer][:id] }
      @data[:officers]  = User.where(
                            id: officer_ids
                          ).order("last_name ASC").map{ |o| { id: o.id, first_name: o.first_name, last_name: o.last_name, full_name: o.to_s } }

      @data
    end
  end
end
