module Core
  module UserBranches
    class Toggle
      attr_accessor :user_branch

      def initialize(user_branch:)
        @user_branch = user_branch
      end

      def execute!
        @user_branch.update!(
          active: !@user_branch.active
        )

        @user_branch
      end
    end
  end
end
