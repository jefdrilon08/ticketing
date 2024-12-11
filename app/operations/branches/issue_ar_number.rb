module Branches
  class IssueArNumber
    attr_accessor :ar_number,
                  :branch

    PADDING = 9

    def initialize(branch:)
      @branch = branch
    end

    def execute!
      new_value = @branch.ar_counter + 1

      number = "#{new_value}".rjust(PADDING, "0")

      @branch.update!(
        ar_counter: new_value
      )

      @ar_number = "#{@branch.ar_prefix}-#{number}"

      @ar_number
    end
  end
end
