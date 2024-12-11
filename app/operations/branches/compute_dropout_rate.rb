module Branches
  class ComputeDropoutRate
    def initialize(config:)
      @config = config
      @year   = @config[:year]
      @month  = @config[:month]
      @branch = @config[:branch]
      @as_of  = Date.new(@year, @month, -1)

      @data = {
        year: @year,
        month: @month,
        as_of: @as_of,
        branch: {
          id: @branch.id,
          name: @branch.name
        },
        records: [],
        officers: [],
        previous_repayment_rate: {},
        repayment_rate: {},
        monthly_new_and_resigned: {}
      }

      @ds_repayment_rate
      @ds_previous_repayment_rate
      @ds_monthly_new_and_resigned
    end

    def execute!

      @data
    end
  end
end
