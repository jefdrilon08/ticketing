module Branches
  class IssueOrNumber
    attr_accessor :or_number,
                  :branch

    PADDING = 9

    def initialize(branch:)
      @branch = branch
    end

    def execute!
      new_value = @branch.or_counter + 1

      number = "#{new_value}".rjust(PADDING, "0")

      @branch.update!(
        or_counter: new_value
      )

      @or_number = "#{@branch.or_prefix}-#{number}"

      @or_number
    end
  end
end
