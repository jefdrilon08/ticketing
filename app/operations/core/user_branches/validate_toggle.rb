module Core
  module UserBranches
    class ValidateToggle < ::Core::Validator
      attr_accessor :payload

      def initialize(branch_id:, user_id:)
        super()
        
        @branch_id  = branch_id
        @user_id    = user_id

        @payload = {
          branch: [],
          user: []
        }
      end

      def execute!
        if @branch_id.present?
          @branch = Branch.find_by_id(@branch_id)
        else
          @payload[:branch] << "required"
        end

        if @user_id.present?
          @user = User.find_by_id(@user_id)
        else
          @payload[:user] << "required"
        end

        if @branch.blank?
          @payload[:branch] << "not found"
        end

        if @user.blank?
          @payload[:user] << "not found"
        end

        count_errors!
      end
    end
  end
end
