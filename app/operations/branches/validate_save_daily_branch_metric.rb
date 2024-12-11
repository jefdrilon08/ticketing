module Branches
  class ValidateSaveDailyBranchMetric < AppValidator
    attr_accessor :errors,
                  :branch_id,
                  :as_of

    def initialize(branch_id:, as_of:)
      super()

      @branch_id  = branch_id
      @as_of      = as_of
    end

    def execute!
      if @branch_id.blank?
        @errors[:messages] << {
          key: "branch_id",
          message: "branch_id required"
        }
      else
        branch = Branch.find_by_id(@branch_id)

        if branch.blank?
          @errors[:messages] << {
            key: "branch_id",
            message: "branch not found"
          }
        end
      end

      if @as_of.blank?
        @errors[:messages] << {
          key: "as_of",
          message: "as_of required"
        }
      end

      #not_yet_implemented!

      @errors[:messages].each do |o|
        @errors[:full_messages] << o[:message]
      end

      @errors
    end
  end
end
