module Branches
  class ComputeWatchlist
    def initialize(config:)
      @config = config
      @branch = @config[:branch]
      @as_of  = @config[:as_of] || Date.today

      @data = {
        branch: {
          id: @branch.id,
          name: @branch.name
        },
        as_of: @as_of,
        loan_products: [],
        centers: [],
        officers: [],
        records: []
      }

      @cmd  = ::Branches::ComputeRr.new(
                config: {
                  branch: @branch,
                  as_of: @as_of
                }
              )
    end

    def execute!
      @cmd.execute!

      @data[:records] = @cmd.data[:records].select{ |o|
                          o[:total_balance].to_f > 0
                        }

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
