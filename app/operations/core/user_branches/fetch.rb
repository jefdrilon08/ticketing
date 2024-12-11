module Core
  module UserBranches
    class Fetch
      attr_accessor :user, :user_branches

      def initialize(user_id:)
        @user_id  = user_id
        @user     = User.find(@user_id)

        @user_branches  = []
        
        @branches = Branch.all.order("name ASC")
      end

      def execute!
        @branches.each do |branch|
          user_branch = UserBranch.where(
            user_id: @user_id,
            branch_id: branch.id
          ).first

          if user_branch.blank?
            user_branch = UserBranch.create(
              user: @user,
              branch: branch,
              active: nil
            )
          end

          @user_branches << user_branch.to_h
        end
      end
    end
  end
end
